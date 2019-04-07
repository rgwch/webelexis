# selfservice

This sub project contains things, patients can do by themselves - at this time, that's just making an appointment. But it's planned to make the patient's own lab values and letters available to themselves later.

For security reasons this subproject is separate now. By default, the selfservice listens at port 4040 and communicates only via a single well-defined path with the webelexis server. So it's possible to expose only selfservice to the outer world and keep webelexis restricted.

To customize the page, please modify views/layout.pug (and probably termin.pug)
