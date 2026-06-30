
const api = "http://192.168.0.11:5500"
export const fetchUsers = async (setUsers) => {
  try {
    const response = await fetch(`${api}/api/v1/users`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetched data");
    }
    if (data.error) {
      console.error("Error while fetching data: ", data.error);
    }
    setUsers(data.data);
  } catch (error) {
    console.error(error);
  }
};

export const fetchProblemCount = async (setState) => {
  try {
    const response = await fetch(`${api}/api/v1/support`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetched data");
    }
    if (data.error) {
      console.error("Error while fetching data: ", data.error);
    }
    setState(data.data.length)
  } catch (error) {
    console.error(error);
  }
};

export const fetchProblems = async (setState) => {
  try {
    const response = await fetch(`${api}/api/v1/support`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetched data");
    }
    if (data.error) {
      console.error("Error while fetching data: ", data.error);
    }
    setState(data.data)
  } catch (error) {
    console.error(error);
  }
};