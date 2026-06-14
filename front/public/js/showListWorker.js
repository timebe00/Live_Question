let timer = null;

self.onmessage = function (e) {
    if (e.data.action === 'start') {
        let url = e.data.url;

        if (timer) {
            clearInterval(timer);
        }

        timer = setInterval(async function () {
            try {
                let response = await fetch(url, { credentials: 'include' });
                let json = await response.json();
                self.postMessage({ success: true, data: json.data });
            } catch (error) {
                self.postMessage({ success: false, error: error.message });
            }
        }, 1000);
    } else if (e.data.action === 'stop') {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    }
};
