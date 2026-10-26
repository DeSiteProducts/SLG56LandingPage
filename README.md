# SLG56LandingPage

## Contact attribution

The form automatically includes `leadSource`, `utmSource`, `utmMedium`, and
`utmCampaign` in the JSON sent through `/api/request` to the email Lambda.
No extra question is shown to visitors. The first arrival in each tab is retained
in sessionStorage across reloads until that tab's session ends. If storage is
unavailable, attribution still works for the current page.

Example campaign links (replace the domain if needed):

| Origin | Link |
| --- | --- |
| Facebook | `https://desiteproducts.com/?utm_source=facebook&utm_medium=paid_social&utm_campaign=slg56` |
| Instagram | `https://desiteproducts.com/?utm_source=instagram&utm_medium=paid_social&utm_campaign=slg56` |
| Google Ads | `https://desiteproducts.com/?utm_source=google&utm_medium=cpc&utm_campaign=slg56` |
| Google organic | Automatically detected from a Google referrer when available |
| Direct | `https://desiteproducts.com/` |

Google Ads click identifiers (`gclid`, `gbraid`, `wbraid`) take priority, then
explicit UTM sources, then the external referrer. Unknown UTM sources or external
sites are classified as `Other`. Missing evidence is `Direct / Unknown`: a browser
can hide the referrer, so this does not prove that a visitor typed the URL.
Use separate Facebook and Instagram UTM links; `fbclid` alone cannot reliably
distinguish these platforms. These fields are client-reported marketing hints,
not verified identity. Raw click IDs and full referrer URLs are not stored.

### Email Lambda integration

The deployed `sendSLG56email` function's source is not in this repository.
Its email template must display `leadSource` (and optionally the three UTM fields)
from the JSON body to make attribution visible in emails. Escape these values
when inserting them into HTML. The API forwards normalized fields with a maximum
of 200 characters per UTM value. Existing clients without attribution still work.
