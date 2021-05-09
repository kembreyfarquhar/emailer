function generateCode() {
  const a = String(Math.floor(Math.random() * 10));
  const b = String(Math.floor(Math.random() * 10));
  const c = String(Math.floor(Math.random() * 10));
  const d = String(Math.floor(Math.random() * 10));
  const numStr = [a, b, c, d].join("");
  return numStr;
}

module.exports = generateCode;
