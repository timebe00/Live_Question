let timer = null;
let inFlight = false;
let abortController = null;

const POLL_INTERVAL_MS = 1000;
const FETCH_TIMEOUT_MS = 8000;

async function poll(url) {
    if (inFlight) {
        return;
    }

    inFlight = true;
    abortController = new AbortController();
    let timeoutId = setTimeout(function () {
        abortController.abort();
    }, FETCH_TIMEOUT_MS);

    try {
        let response = await fetch(url, {
            credentials: 'include',
            signal: abortController.signal
        });
        let json = await response.json();
        self.postMessage({ success: true, data: json.data });
    } catch (error) {
        if (error.name !== 'AbortError') {
            self.postMessage({ success: false, error: error.message });
        }
    } finally {
        clearTimeout(timeoutId);
        inFlight = false;
        abortController = null;
    }
}

function stopPolling() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
    if (abortController) {
        abortController.abort();
    }
}

self.onmessage = function (e) {
    if (e.data.action === 'start') {
        let url = e.data.url;

        stopPolling();

        timer = setInterval(function () {
            poll(url);
        }, POLL_INTERVAL_MS);
    } else if (e.data.action === 'stop') {
        stopPolling();
    }
};
