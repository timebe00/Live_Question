var common
(function (common) {
    async function send(url, method, params, headers = {} ) {
        headers["Content-Type"] = "application/json";
        return fetch(url, {
            method : method,
            headers : headers,
            body : JSON.stringify(params),
            credentials: 'include'
        })
    }
    common.send = send;

    async function enc(txt) {
        return await btoa(unescape(encodeURIComponent(txt || "")));
    }
    common.enc = enc;

    async function dec(txt) {
        return await decodeURIComponent(escape(atob(txt || "")));
    }
    common.dec = dec;

    function closeModal(id) {
        document.getElementById(id).classList.remove('open');
    }
    common.closeModal = closeModal;

    function openModal(id) {
        document.getElementById(id).classList.add('open');
    }
    common.openModal = openModal;

})(common || (common = {}));
