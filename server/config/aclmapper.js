const roles = require('./roles')

module.exports = {
  [roles.guest.id]: ['stickers.find'],
  [roles.agenda.id]: ['termin'],
  [roles.mpa.id]: ['termin', 'article.find', 'auf.find', 'auf.create', 'auf.update',
    'billable.find', 'billing.create',
    'briefe', 'documents', 'fall', 'findings', 'konsultation', 'kontakt',
    'labresults', 'leistungsblock', 'lucinda', 'macros', 'meta-article',
    'patient', 'prescriptions', 'stickers', 'tarmed.find', 'tarmed.get'],
  [roles.doc.id]: ['billing'],
  [roles.user.id]: ['usr.get']
}
