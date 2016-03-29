const getUniqueID = () => (new Date().getTime()+Math.floor(Math.random()*1000)).toString(16);

module.exports = {
  getUniqueID
};
