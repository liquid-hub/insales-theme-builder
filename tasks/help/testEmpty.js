module.exports = (file) => {
  return file && file.stat && file.stat.size;
};
