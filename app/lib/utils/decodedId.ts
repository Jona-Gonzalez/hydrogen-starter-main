export const decodedId = (id) => {
  try {
    if (!id) return undefined;
    return window.atob(id);
  } catch (error) {
    return id;
  }
};
