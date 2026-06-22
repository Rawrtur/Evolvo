export const fetchUsers = async (setUsers) => {
  try {
    const api = "http://192.168.137.1:5500";
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

export const fetchData = async (setUsers) => {
  try {
    const api = "http://192.168.137.1:5500";
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
    return data.data
  } catch (error) {
    console.error(error);
  }
};
