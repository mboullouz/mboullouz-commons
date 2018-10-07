import {Utils} from "../utils/Utils";
import {DateTimeFormatter, LocalDateTime} from "js-joda";

export class Logger {
    constructor(public context: string) {
    }

    public static canLog(): boolean { 
        if (!Utils.isBrowser()) {
            return true;
        }
        return (
            window.location.host.indexOf("localhost") > -1 ||
            window.location.host.indexOf("dev") > -1
        )
    }

    public info(...msgs: any[]): void {
        const t = LocalDateTime.now();
        if (Logger.canLog()) {
            if (msgs) {
                msgs.forEach(e => console.log(`%c[${t.format(DateTimeFormatter.ofPattern("H:m:s"))} - ${this.context}] : %c`+ e, 'color: #90A4AE; font-size:10px;','color:#101094'));
            }
        }
    }
}