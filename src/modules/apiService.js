function apiService(searchQuery, pageNumber, perPage) {
  return fetch(`
    https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${searchQuery}&page=${pageNumber}&per_page=${perPage}&key=17903714-8f5ebcdc0900c0123ad2db8f4`)
    .then(res => res.json())
    .catch(err => {
      notify('isError');
      console.log(err);
    });
}

export default apiService;
