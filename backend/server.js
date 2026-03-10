import app from "./app.js";
 import color from 'colors'

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`server starts on port ${port}`.cyan.underline);
})
