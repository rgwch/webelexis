import { Directory } from './directory.class'

export default app => {
  const options = app.get("directory")
  app.use("/directory", new Directory(app, options))
}
