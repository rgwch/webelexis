const roles = require('./roles')

const mappings = {
  [roles.guest.id]: ['stickers.find'],
  [roles.agenda.id]: ['termin'],
  [roles.mpa.id]: ['termin', 'article.find', 'auf.find', 'auf.create', 'auf.update',
    'billable.find', 'billing.create',
    'briefe', 'documents', 'fall', 'findings', 'konsultation', 'kontakt',
    'labresults', 'leistungsblock', 'lucinda', 'macros', 'meta-article',
    'patient', 'prescriptions', 'stickers', 'tarmed.find', 'tarmed.get'],
  [roles.doc.id]: ['billing'],
  [roles.user.id]: ['user.get']
}

// user role includes guest role and agenda rolw
mappings[roles.user.id] = [...mappings[roles.guest.id], ...mappings[roles.user.id], ...mappings[roles.agenda.id]]
// mpa role includes user role
mappings[roles.mpa.id] = [...mappings[roles.user.id],...mappings[roles.mpa.id]]
// doctor role includes mpa role
mappings[roles.doc.id] = [...mappings[roles.mpa.id], ...mappings[roles.doc.id]]

module.exports = mappings
