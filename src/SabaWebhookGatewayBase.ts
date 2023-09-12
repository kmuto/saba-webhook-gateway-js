/*
    Saba Webhook Gateway base
    Copyright 2023 Kenshi Muto <kmuto@kmuto.jp>
*/
import strftime from "strftime";

export class SabaWebhookGatewayBase {
    toDateString(epoch: number): string {
        return strftime("%m/%d %H:%M", new Date(epoch * 1000));
    }

    parse(json: string): any {
        try {
           return JSON.parse(json);
        } catch (err) {
            console.log(`parser error\n${json}`);
            return null;
        }
    }

    sample(h: any): any {
        console.log(`[sample]\n${h}`);
        return {
            event: "sample"
        };
    }

    alert(h: any): any {
        console.log(`[alert]\n${h}`);
        return {
            event: "alert"
        };
    }

    alertGroup(h: any): any {
        console.log(`[alertGroup]\n${h}`);
        return {
            event: "alertGroup"
        };
    }

    hostRegister(h: any): any {
        console.log(`[hostRegsiter]\n${h}`);
        return {
            event: "hostRegister"
        };
    }

    hostStatus(h: any): any {
        console.log(`[hostStatus]\n${h}`);
        return {
            event: "hostStatus"
        };
    }

    hostRetire(h: any): any {
        console.log(`[hostRetire]\n${h}`);
        return {
            event: "hostRetire"
        };
    }

    monitorCreate(h: any): any {
        switch(h.monitor.type) {
            case "host": return this.monitorCreateHost(h);
            case "external": return this.monitorCreateExternal(h);
            case "expression": return this.monitorCreateExpression(h);
            case "anomalyDetection": return this.monitorCreateAnomalyDetection(h);
            case "service": return this.monitorCreateService(h);
            case "connectivity": return this.monitorCreateConnectivity(h);
        }
    }

    monitorCreateHost(h: any): any {
        console.log(`[monitorCreateHost]\n${h}`);
        return {
            event: "monitorCreate/host"
        };
    }

    monitorCreateExternal(h: any): any {
        console.log(`[monitorCreateExternal]\n${h}`);
        return {
            event: "monitorCreate/external"
        };
    }

    monitorCreateExpression(h: any): any {
        console.log(`[monitorCreateExpression]\n${h}`);
        return {
            event: "monitorCreate/expression"
        };
    }

    monitorCreateAnomalyDetection(h: any): any {
        console.log(`[monitorCreateAnomalyDetection]\n${h}`);
        return {
            event: "monitorCreate/anomalyDetection"
        };
    }

    monitorCreateService(h: any): any {
        console.log(`[monitorCreateService]\n${h}`);
        return {
            event: "monitorCreate/service"
        };
    }

    monitorCreateConnectivity(h: any): any {
        console.log(`[monitorCreateConnectivity]\n${h}`);
        return {
            event: "monitorCreate/connectivity"
        };
    }

    monitorUpdate(h: any): any {
        switch(h.monitor.type) {
            case "host": return this.monitorUpdateHost(h);
            case "external": return this.monitorUpdateExternal(h);
            case "expression": return this.monitorUpdateExpression(h);
            case "anomalyDetection": return this.monitorUpdateAnomalyDetection(h);
            case "service": return this.monitorUpdateService(h);
            case "connectivity": return this.monitorUpdateConnectivity(h);
        }
    }

    monitorUpdateHost(h: any): any {
        console.log(`[monitorUpdateHost]\n${h}`);
        return {
            event: "monitorUpdate/host"
        };
    }

    monitorUpdateExternal(h: any): any {
        console.log(`[monitorUpdateExternal]\n${h}`);
        return {
            event: "monitorUpdate/external"
        };
    }

    monitorUpdateExpression(h: any): any {
        console.log(`[monitorUpdateExpression]\n${h}`);
        return {
            event: "monitorUpdate/expression"
        };
    }

    monitorUpdateAnomalyDetection(h: any): any {
        console.log(`[monitorUpdateAnomalyDetection]\n${h}`);
        return {
            event: "monitorUpdate/anomalyDetection"
        };
    }

    monitorUpdateService(h: any): any {
        console.log(`[monitorUpdateService]\n${h}`);
        return {
            event: "monitorUpdate/service"
        };
    }

    monitorUpdateConnectivity(h: any): any {
        console.log(`[monitorUpdateConnectivity]\n${h}`);
        return {
            event: "monitorUpdate/connectivity"
        };
    }

    monitorDelete(h: any): any {
        switch(h.monitor.type) {
            case "host": return this.monitorDeleteHost(h);
            case "external": return this.monitorDeleteExternal(h);
            case "expression": return this.monitorDeleteExpression(h);
            case "anomalyDetection": return this.monitorDeleteAnomalyDetection(h);
            case "service": return this.monitorDeleteService(h);
            case "connectivity": return this.monitorDeleteConnectivity(h);
        }
    }

    monitorDeleteHost(h: any): any {
        console.log(`[monitorDeleteHost]\n${h}`);
        return {
            event: "monitorDelete/host"
        };
    }

    monitorDeleteExternal(h: any): any {
        console.log(`[monitorDeleteExternal]\n${h}`);
        return {
            event: "monitorDelete/external"
        };
    }

    monitorDeleteExpression(h: any): any {
        console.log(`[monitorDeleteExpression]\n${h}`);
        return {
            event: "monitorDelete/expression"
        };
    }

    monitorDeleteAnomalyDetection(h: any): any {
        console.log(`[monitorDeleteAnomalyDetection]\n${h}`);
        return {
            event: "monitorDelete/anomalyDetection"
        };
    }

    monitorDeleteService(h: any): any {
        console.log(`[monitorDeleteService]\n${h}`);
        return {
            event: "monitorDelete/service"
        };
    }

    monitorDeleteConnectivity(h: any): any {
        console.log(`[monitorDeleteConnectivity]\n${h}`);
        return {
            event: "monitorDelete/connectivity"
        };
    }

    handle_by_event(h: any): any {
        switch(h.event) {
            case "sample": return this.sample(h);
            case "alert": return this.alert(h);
            case "alertGroup": return this.alertGroup(h);
            case "hostRegister": return this.hostRegister(h);
            case "hostStatus": return this.hostStatus(h);
            case "hostRetire": return this.hostRetire(h);
            case "monitorCreate": return this.monitorCreate(h);
            case "monitorUpdate": return this.monitorUpdate(h);
            case "monitorDelete": return this.monitorDelete(h);
        }
    }

    post(json: string) {
        console.log(`[post]\n${json}`);
    }

    run(h: any): any {
        const result = this.handle_by_event(h);
        const json = JSON.stringify(result);
        if (json) {
            this.post(json);
        }
    }
}
