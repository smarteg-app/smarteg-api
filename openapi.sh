docker run --rm -i yousan/swagger-yaml-to-html < openapi.yaml > app/templates/pages/index.html
awk 'NR==6{print "  <meta name=\"robots\" content=\"none\" />"}1' app/templates/pages/index.html > temp.html && mv temp.html app/templates/pages/index.html
awk 'NR==7{print "  <meta name=\"googlebot\" content=\"none\" />"}1' app/templates/pages/index.html > temp.html && mv temp.html app/templates/pages/index.html
sed -i '8d' app/templates/pages/index.html
awk -v TITLE="$(sed -n '3{s/^[[:space:]]*title:[[:space:]]*//;s/[[:space:]]*$//;p;q}' openapi.yaml)" 'NR==8{print "  <title>" TITLE " - Swagger UI</title>"}1' app/templates/pages/index.html > temp.html && mv temp.html app/templates/pages/index.html
awk -v UMAMI_ID="$(. <(tr -d '\r' < ./.env); printf %s "$UMAMI_ID")" -v API_HOST="$(. <(tr -d '\r' < ./.env); printf %s "$API_HOST")" 'NR==11{print "  <script defer src=\"https://stat.faizath.com/script.js\" data-website-id=\"" UMAMI_ID "\" data-domains=\"" API_HOST "\"></script>"}1' app/templates/pages/index.html > temp.html && mv temp.html app/templates/pages/index.html
# BEGIN domain-notice
export _DOMAIN_NOTICE=$(cat <<'HTMLEOF'
<div id="domain-notice" style="
  font-family: 'Titillium Web', 'Open Sans', sans-serif;
  background: #fff;
  border: 1px solid #d8dde7;
  border-left: 4px solid #49cc90;
  border-radius: 4px;
  margin: 16px;
  padding: 16px 20px;
  position: relative;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
">
  <button onclick="(function(){document.getElementById('domain-notice').style.display='none';try{localStorage.setItem('ch-domain-notice-dismissed','1')}catch(e){}})()" style="
    position: absolute;
    top: 10px;
    right: 12px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 20px;
    line-height: 1;
    color: #7d8492;
    padding: 0 4px;
  " aria-label="Dismiss">&times;</button>
  <div style="text-align: center;">
    <p style="margin: 0 0 8px; font-size: 16px; font-weight: 600; color: #3b4151;">📢 Domain &amp; Email Migration Notice</p>
    <p style="margin: 0 0 8px; font-size: 13px; color: #3b4151;">From July 24th, 2026, Smarteg will transition to new domains as <code style="background:#f0f0f0;padding:1px 4px;border-radius:3px;font-family:'Source Code Pro',monospace;font-size:12px;">smarteg.app</code> will not be renewed:</p>
    <p style="margin: 0; font-size: 13px; color: #3b4151; line-height: 1.8;">
      🌐 <strong>Website:</strong> <a href="https://smarteg.faizath.com" style="color:#49cc90;">smarteg.faizath.com</a> <span style="color:#7d8492;">(formerly <em>smarteg.app</em>)</span><br>
      ⚙️ <strong>API:</strong> <a href="https://smarteg-api.faizath.com" style="color:#49cc90;">smarteg-api.faizath.com</a> <span style="color:#7d8492;">(formerly <em>api.smarteg.app</em>)</span><br>
      📧 <strong>Email:</strong> <a href="mailto:contact@smarteg.faizath.com" style="color:#49cc90;">contact@smarteg.faizath.com</a> <span style="color:#7d8492;">(formerly <em>contact@smarteg.app</em>)</span><br>
      🛰️ <strong>CDN:</strong> <span style="color:#49cc90;">smarteg-cdn.faizath.com</span> <span style="color:#7d8492;">(formerly <em>cdn.smarteg.app</em>)</span><br>
      📈 <strong>Status Pages:</strong> <a href="https://status.faizath.com/status/smarteg" style="color:#49cc90;">status.faizath.com/status/smarteg</a> <span style="color:#7d8492;">(formerly <em>status.smarteg.app</em>)</span><br>    </p>
  </div>
</div>
<script>
  try { if (localStorage.getItem('ch-domain-notice-dismissed')) document.getElementById('domain-notice').style.display = 'none'; } catch(e) {}
</script>
HTMLEOF
)
python3 - "app/templates/pages/index.html" <<'INJEOF'
import os, sys
block = os.environ['_DOMAIN_NOTICE']
marker = '<div id="swagger-ui">'
path = sys.argv[1]
text = open(path).read()
if marker in text and 'id="domain-notice"' not in text:
    text = text.replace(marker, block + '\n' + marker, 1)
    open(path, 'w').write(text)
INJEOF
# END domain-notice
