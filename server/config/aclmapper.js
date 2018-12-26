const roles = require('./roles')

module.exports = {
  [roles.guest]: ['stickers.find'],
  [roles.agenda]: ['termin'],
  [roles.mpa]: ['termin', 'article.find', 'auf.find', 'auf.create', 'auf.update',
    'billable.find', 'billing.create',
    'briefe', 'documents', 'fall', 'findings', 'konsultation', 'kontakt',
    'labresults', 'leistungsblock', 'lucinda', 'macros', 'meta-article',
    'patient', 'prescriptions', 'stickers', 'tarmed.find', 'tarmed.get'],
  [roles.doc]: ['billing'],
  [roles.user]: ['usr.get']
}
