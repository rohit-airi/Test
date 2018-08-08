window.onAmazonLoginReady = function () {
  amazon.Login.setClientId('amzn1.application-oa2-client.a39b052e4b544af18fe00920afded5bb');
};
(function (d) {
  var a = d.createElement('script'); a.type = 'text/javascript';
  a.async = true; a.id = 'amazon-login-sdk';
  a.src = 'https://api-cdn.amazon.com/sdk/login1.js';
  d.getElementById('amazon-root').appendChild(a);
})(document);
function callAmzon(event) {
  var baseUrl=event.currentTarget.value;
  options = { scope: 'cpc_advertising:campaign_management', response_type : 'code' };
  amazon.Login.authorize(options, baseUrl);
  return false;
};
