export const isValidEmail = (email) => {
  const isValid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  return isValid.test(email);
};

export const getToken = () => {
  return localStorage.getItem("auth-token");
};

export const catchError = (error) => {
  //console.log(error.response.data);
  const { response } = error;
  if (response?.data) return response.data;

  return { error: error.message || error };
};

export const renderItem = (result) => {
  return (
    <div
      key={result.id}
      className="
      flex
      space-x-2
      rounded
      overflow-hidden"
    >
      <img
        src={result.avatar}
        alt={result.name}
        className="w-16 h-16 object-cover"
      />
      <p className="dark:text-white font-semibold">{result.name}</p>
    </div>
  );
};

export const getPoster = (posters = []) => {
  //same as posters.length
  const { length } = posters;

  if (!length) return null;

  //if poster has more then 2 items then select the 2nd poster
  if (length > 2) return posters[1];

  //other wise, select the first poster
  return posters[0];
};
