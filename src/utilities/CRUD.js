const BACKEND_URL = process.env.REACT_APP_API_URL;

async function fetchJSON(endpoint, options) {
  const response = await fetch(`${BACKEND_URL}${endpoint}`, options);
  if (!response.ok) {
    const responseData = await response.json();
    const errorMessage = `API Error: ${responseData.message}`;
    throw new Error(errorMessage);
  }

  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    return {};
  }

  return response.json();
}

export async function fetchGet({ endpoint, params = {}, headers = {} }) {
  // Construct query string from params object
  const queryString = Object.keys(params)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join("&");

  // Append query string to URL if it exists
  const requestUrl = queryString ? `${endpoint}?${queryString}` : endpoint;

  const options = {
    method: "GET",
    credentials: "include",
    headers,
  };
  return fetchJSON(requestUrl, options);
}

export async function fetchPost({ endpoint, data = {}, headers = {} }) {
  const options = {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(data),
  };
  return fetchJSON(endpoint, options);
}

export async function fetchPut({ endpoint, data = {}, headers = {} }) {
  const options = {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(data),
  };
  return fetchJSON(endpoint, options);
}

export async function fetchDelete({ endpoint, headers = {} }) {
  const options = {
    method: "DELETE",
    credentials: "include",
    headers,
  };
  return fetchJSON(endpoint, options);
}
