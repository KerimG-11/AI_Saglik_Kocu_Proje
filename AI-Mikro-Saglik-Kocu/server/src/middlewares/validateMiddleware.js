function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateRegister(req, res, next) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Tum alanlar zorunludur." });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Gecerli bir email giriniz." });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ message: "Sifre en az 6 karakter olmali." });
  }
  return next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email ve sifre zorunludur." });
  }
  return next();
}

function validateHealthData(req, res, next) {
  const { sleep_hours, step_count, water_amount, stress_level } = req.body;
  const values = [sleep_hours, step_count, water_amount, stress_level];
  if (values.some((item) => item === undefined || item === null || item === "")) {
    return res.status(400).json({ message: "Tum saglik alanlari doldurulmalidir." });
  }

  const parsed = {
    sleep_hours: Number(sleep_hours),
    step_count: Number(step_count),
    water_amount: Number(water_amount),
    stress_level: Number(stress_level)
  };

  if (Object.values(parsed).some((value) => Number.isNaN(value))) {
    return res.status(400).json({ message: "Alanlar sayisal olmalidir." });
  }

  if (parsed.stress_level < 1 || parsed.stress_level > 10) {
    return res.status(400).json({ message: "Stres seviyesi 1-10 araliginda olmalidir." });
  }

  req.body = parsed;
  return next();
}

module.exports = {
  validateRegister,
  validateLogin,
  validateHealthData
};
