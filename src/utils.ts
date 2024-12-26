export const logger = (() => {
    const isDev = process.env.NODE_ENV === "development";

    const formatMessage = (level: string) => {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] [${level}]`;
    };

    return {
        log: (...messages: any[]) => {
            if (isDev) {
                // console.log(formatMessage("LOG"), messages);
            } else {
                // console.debug(formatMessage("LOG"), messages);
            }
        },
        warn: (...messages: any[]) => {
            if (isDev) {
                console.warn(formatMessage("WARN"), messages);
            }
        },
        error: (...messages: any[]) => {
            if (isDev) {
                console.error(formatMessage("ERROR"), messages);
            }
        },
        info: (...messages: any[]) => {
            if (isDev) {
                console.info(formatMessage("INFO"), messages);
            }
        },
    };
})();
