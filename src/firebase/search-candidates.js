import {
  collection,
  where,
  query,
  getDocs,
  or,
  and,
  limit,
  limitToLast,
  orderBy,
  startAfter,
  endBefore,
  getCountFromServer,
  startAt,
  endAt,
} from "firebase/firestore";
import { distanceBetween, geohashQueryBounds } from "geofire-common";
import { db } from ".";

const getHospitalityAndClause = (filters) => {
  const { role, establishmentType } = filters;

  let andClause = and(
    where("role", "==", "candidate"),
    where("experience.sector", "==", "Hospitality"),
    or(
      where("experience.first_role_preference", "==", role),
      where("experience.second_role_preference", "==", role)
    )
  );

  if (establishmentType !== "any") {
    andClause = and(
      andClause,
      or(
        where("experience.main_type_of_establishment", "==", establishmentType),
        where("experience.second_type_of_establishment", "==", establishmentType)
      )
    );
  }

  return andClause;
};

const getConstructionAndClause = (filters) => {
  const { constructionRole, constructionCardType } = filters;

  let andClause = and(
    where("role", "==", "candidate"),
    where("experience.sector", "==", "Construction"),
    where("experience.construction_role", "==", constructionRole)
  );

  if (constructionCardType !== "any") {
    andClause = and(
      andClause,
      where("experience.construction_card_type", "==", constructionCardType)
    );
  }

  return andClause;
};

const getAndClause = (filters) => {
  const { yearsOfExperience, verified, postalCode, distance } = filters;

  let sectorAndClause =
    filters.sector === "Construction"
      ? getConstructionAndClause(filters)
      : getHospitalityAndClause(filters);

  if (verified) {
    // If recruiter is searching for verified candidates, we show only verified candidates.
    // If not, we show all candidates.
    sectorAndClause = and(sectorAndClause, where("verified", "==", true));
  }

  if (yearsOfExperience !== "any") {
    sectorAndClause = and(
      sectorAndClause,
      where("experience.years_of_experience", "==", yearsOfExperience)
    );
  }

  // If only postcode is provided, we check for exact match.
  if (postalCode && !distance) {
    sectorAndClause = and(sectorAndClause, where("postal_code", "==", postalCode));
  }

  return sectorAndClause;
};

/**
 * @param {string} direction - Direction of the pagination.
 * @param {Object} filters - Filters to be applied to the search.
 * @param {string} filters.sector - Sector of the candidates.
 * Fields for Hospitality sector:
 * @param {string} filters.role - Role of the candidates.
 * @param {string} filters.establishmentType - Establishment type of the candidates.
 * Fields for Construction sector:
 * @param {string} filters.constructionRole - Role of the candidates.
 * @param {string} filters.constructionCardType - Card type of the candidates.
 * Shared fields:
 * @param {string} filters.yearsOfExperience - Years of experience of the candidates.
 * @param {string} filters.postalCode - Postal code of the candidates.
 * @param {number} filters.distance - Distance from the postal code to search for candidates.
 * @param {boolean} filters.verified - Whether the candidates are verified.
 * @param {number} limitPerPage - The number of candidates to display per page.
 */
export const getPaginatedCandidates = async ({
  direction,
  filters,
  lastDoc,
  firstDoc,
  limitPerPage,
}) => {
  const usersCollection = collection(db, "users");

  const andClause = getAndClause(filters);

  // TODO: order the results dynamically by parameter coming from outside
  const orderByClause = orderBy("first_name", "desc");

  let candidatesQuery = query(usersCollection, andClause, orderByClause, limit(limitPerPage));

  if (direction === "next" && lastDoc) {
    candidatesQuery = query(candidatesQuery, startAfter(lastDoc));
  } else if (direction === "prev" && firstDoc) {
    candidatesQuery = query(
      usersCollection,
      andClause,
      orderByClause,
      endBefore(firstDoc),
      limitToLast(limitPerPage)
    );
  }
  const snapshot = await getDocs(candidatesQuery);
  const candidatesData = snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
  return {
    candidatesData,
    firstDocument: snapshot.docs[0],
    lastDocument: snapshot.docs[snapshot.docs.length - 1],
  };
};

export const getCandidatesCount = async ({ filters }) => {
  const usersCollection = collection(db, "users");

  const andClause = getAndClause(filters);

  const count = await getCountFromServer(query(usersCollection, andClause));

  return count.data().count;
};

/**
 * @param {Object} postalCodeData - Data of the postal code (one of the filters).
 * @param {Object} filters - Filters to be applied to the search.
 * @param {number} filters.distance - Distance from the postal code to search for candidates.
 * @returns {Array} - Array of candidates within the distance from the postal code.
 */
export const getCandidatesByDistance = async ({ postalCodeData, filters }) => {
  const { distance } = filters;
  const usersCollection = collection(db, "users");

  const { latitude, longitude } = postalCodeData;

  const center = [latitude, longitude];
  const radiusInM = distance * 1000;

  // Each item in 'bounds' represents a startAt/endAt pair. We have to issue
  // a separate query for each pair. There can be up to 9 pairs of bounds
  // depending on overlap, but in most cases there are 4.
  const bounds = geohashQueryBounds(center, radiusInM);

  const andClause = getAndClause(filters);

  const promises = bounds.map((bound) => {
    const q = query(
      usersCollection,
      andClause,
      orderBy("geohash"),
      startAt(bound[0]),
      endAt(bound[1])
    );

    return getDocs(q);
  });

  const snapshots = await Promise.all(promises);

  const matchingDocs = [];
  snapshots.forEach((snap) => {
    snap.docs.forEach((doc) => {
      const docData = doc.data();
      const { postal_code_latitude: lat, postal_code_longitude: lng } = docData;

      // We have to filter out a few false positives due to GeoHash
      // accuracy, but most will match
      const distanceInKm = distanceBetween([lat, lng], center);
      const distanceInM = distanceInKm * 1000;
      if (distanceInM <= radiusInM) {
        matchingDocs.push({ ...docData, id: doc.id });
      }
    });
  });

  return matchingDocs;
};

/**
 * Fetch the count of candidates by sector.
 * @param {string} sector - Sector of the candidates.
 * @returns {number} - Count of candidates in the sector.
 */
export const getCandidatesCountBySector = async (sector) => {
  const usersCollection = collection(db, "users");

  const count = await getCountFromServer(
    query(
      usersCollection,
      where("role", "==", "candidate"),
      where("experience.sector", "==", sector)
    )
  );

  return count.data().count;
};
