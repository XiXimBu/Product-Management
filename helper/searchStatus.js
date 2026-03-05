module.exports = (query) => {
  
    let ObjectSearch = {
      keyword : "",
      regex: null
    }

  if (query.keyword) {
    ObjectSearch.keyword = query.keyword
    ObjectSearch.regex = new RegExp(ObjectSearch.keyword, "i")
  }

  return ObjectSearch;
};