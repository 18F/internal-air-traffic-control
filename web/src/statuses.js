const ucfirst = require("ucfirst");

module.exports = {
    list: [
        "preflight",
        "taxiing",
        "climbing",
        "in flight",
        "landing",
        "landed",
        "at gate",
        "complete"
    ],
    getPrettyName(status) {
        const parts = status.split(" ");
        for(let i = 0; i < parts.length; i++) {
            parts[i] = ucfirst(parts[i]);
        }
        return parts.join(" ");
    }
};
