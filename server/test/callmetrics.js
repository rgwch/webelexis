const app = require('../src/app');

const loadKontakt = async () => {
  const service = app.service("kontakt")
  const starttime = new Date().getTime();
  const k = await service.find()
  const endtime = new Date().getTime()
  const duration = (endtime - starttime) / 1000
  console.log(`${k.data.length} Kontakte, ${duration} Sekunden`)

}

const loadKons = async () => {
  const service = app.service("konsultation")
  const starttime = new Date().getTime();
  const k = await service.find()
  const endtime = new Date().getTime()
  const duration = (endtime - starttime) / 1000
  console.log(`${k.data.length} Konsultationen, ${duration} Sekunden`)
}
const loadKonsFor = async () => {
  const service = app.service("konsultation")
  const starttime = new Date().getTime();
  const k = await service.find({ query: { $limit: 50, $skip: 0, patientId: "ff5e58b44d1f2c3def86" } })
  const endtime = new Date().getTime()
  const duration = (endtime - starttime) / 1000
  console.log(`${k.data.length} Konsultationen, ${duration} Sekunden`)

}
loadKontakt()
loadKons()
loadKonsFor()

