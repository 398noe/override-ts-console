const originalConsole = { ...console };

const customConsole = {
    // 既存のconsoleを展開
    ...originalConsole,
    // overrideする関数だけ定義する
    log: (...args: any[]) => {
        logToJSONWithStackTrace('log', args);
    },
    debug: (...args: any[]) => {
        logToJSONWithStackTrace('debug', args);
    },
    warn: (...args: any[]) => {
        logToJSONWithStackTrace("warn", args);
    },
    error: (...args: any[]) => {
        logToJSONWithStackTrace("error", args);
    },
}

/**
 * console出力をjson形式に上書きする関数
 * @param type console出力のタイプ
 * @param args 出力するもの
 */
const logToJSON = (type: "log" | "warn" | "debug" | "error", args: any[]) => {
    const logObject = {
        time: new Date().toISOString(),
        message: args.map(arg => (typeof arg === 'string' ? arg : JSON.stringify(arg))),
    }

    originalConsole[type](JSON.stringify(logObject));
}

/**
 * 
 * @param args 
 * @returns 
 */
const logToJSONWithStackTrace = (type: "log" | "warn" | "debug" | "error", args: any[]) => {
    // 何もない場合は出力しない
    if (args.length === 0) {
        return;
    }
    if (args.length > 0) {
        const error = args[0];
        // エラーの場合はstackTraceを出力する
        if (error instanceof Error) {
            const logObject = {
                time: new Date().toISOString(),
                message: error.message,
                stackTrace: error.stack,
            }
            originalConsole[type](JSON.stringify(logObject));
            return;
        }
    }

    originalConsole[type](...args)
}

console = { ...customConsole };

// test
try {
    console.log("これはどうかしら？")
    console.debug("ふむふむ…")
    console.warn("危ないぞ！")
    console.error("当たらないよっ！")
    throw new Error("Test Error");
} catch (e) {
    console.error(e);
}
