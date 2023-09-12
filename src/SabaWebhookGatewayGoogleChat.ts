/*
    Saba Webhook Gateway for Google Chat
    Copyright 2023 Kenshi Muto <kmuto@kmuto.jp>
*/
import { SabaWebhookGatewayBase } from "./SabaWebhookGatewayBase.js";
import * as https from "https";
import "dotenv/config";

export class SabaWebhookGatewayGoogleChat extends SabaWebhookGatewayBase {
    googlechatCard(header: any, sections: any): any {
        return { cards: { header: header, sections: sections } };
    }

    sample(h: any): any {
        const header = { title: "notification test" };
        const widget1 = [{ textParagraph: { text: h.message } }];
        const sections = [{ widgets: widget1 }];
        return this.googlechatCard(header, sections);
    }

    alert(h: any): any {
        const header: any = { title: `[${h.orgName}] ${h.alert.status.toUpperCase()}: ${h.alert.monitorName}` };
        const startTime = this.toDateString(h.alert.openedAt);
        const endTime = h.alert.closedAt ? this.toDateString(h.alert.closedAt) : null;
        header["subtitle"] = endTime ? `from ${startTime} to ${endTime}` : `from ${startTime}`;
        const sa :string[] = [];
        sa.push(`<a href="${h.alert.url}">View Alert</a>`);

        if (h.host && h.host.roles) {
            sa.push(`Host: <a href="${h.host.url}">${h.host.name}</a>`);
            for (const a of h.host.roles) {
                sa.push(`Role: [<a href="${a.serviceUrl}">${a.serviceName}</a>] <a href="${a.roleUrl}">${a.roleName}</a>`);
            }
        }
        
        if (h.service && h.service.roles) {
            sa.push(`Service: ${h.service.name}`);
            for (const a of h.service.roles) {
                sa.push(`Role: [<a href="${a.serviceUrl}">${a.serviceName}</a>] <a href="${a.roleUrl}">${a.roleName}</a>`);
            }
        }

        if (h.alert.metricLabel) {
            if (h.alert.status === "ok") {
                if (h.alert.metricValue) {
                    sa.push(`Metric: ${h.alert.metricLabel} ${h.alert.metricValue}`);
                } else {
                    sa.push(`Metric: ${h.alert.metricLabel}`);
                }
            } else {
                const threshold = h.alert.status === "critical" ? h.alert.criticalThreshold : h.alert.warningThreshold;
                sa.push(`Metric: ${h.alert.metricLabel} ${h.alert.metricValue} ${h.alert.monitorOperator} ${threshold}`);
            }
        }

        const widget1 = [{ textParagraph: {text: sa.join("\n") } }];
        const sections: any = [{ widgets: widget1 }];

        if (h.imageUrl) {
            const widget2 = [{
                image: {
                    imageUrl: h.imageUrl,
                    onClick: {
                        openLink: {
                            url: h.alert.url
                        }
                    }
                }
            }];
            sections.push({ widgets: widget2 });
        }

        if (h.memo) {
            const widget3 = [{ textParagraph: { text: h.memo } }];
            sections.push({ widgets: widget3 });
        }

        return this.googlechatCard(header, sections);
    }

    alertGroup(h: any): any {
        const header: any = { title: `[${h.orgName}] ${h.alertGroup.status.toUpperCase()}: ${h.alertGroupSetting.name}` };
        const startTime = this.toDateString(h.alertGroup.createdAt);
        const endTime = h.alertGroup.closedAt ? this.toDateString(h.alertGroup.closedAt) : null;
        header["subtitle"] = endTime ? `from ${startTime} to ${endTime}` : `from ${startTime}`;
        const sa :string[] = [];
        sa.push(`<a href="${h.alertGroup.url}">View Alert</a>`);

        const widget1 = [{ textParagraph: {text: sa.join("\n") } }];
        const sections: any = [{ widgets: widget1 }];

        if (h.alertGroupSetting.memo) {
            const widget2 = [{ textParagraph: { text: h.alertGroupSetting.memo } }];
            sections.push({ widgets: widget2 });
        }

        return this.googlechatCard(header, sections);
    }

    hostRegister(h: any): any {
        const header: any = { title: `[${h.orgName}] Host ${h.host.name} is registered` };

        const sa :string[] = [];
        if (h.user) {
            sa.push(`Registered by: ${h.user.screenName}`);
        }

        if (h.host.roles) {
            sa.push(`Host: <a href="${h.host.url}">${h.host.name}</a>`);
            for (const a of h.host.roles) {
                sa.push(`Role: [<a href="${a.serviceUrl}">${a.serviceName}</a>] <a href="${a.roleUrl}">${a.roleName}</a>`);
            }
        }

        const widget1 = [{ textParagraph: {text: sa.join("\n") } }];
        const sections: any = [{ widgets: widget1 }];

        return this.googlechatCard(header, sections);
    }

    hostStatus(h: any): any {
        const header: any = { title: `[${h.orgName}] Host ${h.host.name} is changed to ${h.host.status}` };

        const sa :string[] = [];
        if (h.user) {
            sa.push(`Changed by: ${h.user.screenName}`);
        }

        sa.push(`Previous: ${h.fromStatus}`);
        if (h.host.roles) {
            sa.push(`Host: <a href="${h.host.url}">${h.host.name}</a>`);
            for (const a of h.host.roles) {
                sa.push(`Role: [<a href="${a.serviceUrl}">${a.serviceName}</a>] <a href="${a.roleUrl}">${a.roleName}</a>`);
            }
        }

        const widget1 = [{ textParagraph: {text: sa.join("\n") } }];
        const sections: any = [{ widgets: widget1 }];

        return this.googlechatCard(header, sections);
    }

    hostRetire(h: any): any {
        const header: any = { title: `[${h.orgName}] Host ${h.host.name} is retired` };

        const sa :string[] = [];
        if (h.user) {
            sa.push(`Retired by: ${h.user.screenName}`);
        }

        if (h.host.roles) {
            sa.push(`Host: <a href="${h.host.url}">${h.host.name}</a>`);
            for (const a of h.host.roles) {
                sa.push(`Role: [<a href="${a.serviceUrl}">${a.serviceName}</a>] <a href="${a.roleUrl}">${a.roleName}</a>`);
            }
        }

        const widget1 = [{ textParagraph: {text: sa.join("\n") } }];
        const sections: any = [{ widgets: widget1 }];

        return this.googlechatCard(header, sections);
    }

    monitorCreateCommon(h: any, target: string): any {
        const header: any = { title: `[${h.orgName}] Monitor ${h.monitor.name} is created` };

        const sa :string[] = [];
        if (h.user) {
            sa.push(`Created by: ${h.user.screenName}`);
        }

        sa.push(target);

        const widget1 = [{ textParagraph: {text: sa.join("\n") } }];
        const sections: any = [{ widgets: widget1 }];

        if (h.monitor.memo) {
            const widget2 = [{ textParagraph: { text: h.monitor.memo } }];
            sections.push({ widgets: widget2 });
        }

        return this.googlechatCard(header, sections);
    }

    monitorCreateHost(h: any): any {
        return this.monitorCreateCommon(h, `Target: Host metric (${h.monitor.metric})`);
    }

    monitorCreateExternal(h: any): any {
        return this.monitorCreateCommon(h, `Target: External (${h.monitor.url})`);
    }

    monitorCreateExpression(h: any): any {
        return this.monitorCreateCommon(h, `Target: Expression (${h.monitor.expression})`);
    }

    monitorCreateAnomalyDetection(h: any): any {
        return this.monitorCreateCommon(h, `Target: Anomaly detection (${h.monitor.scopes.join(", ")})`);
    }

    monitorCreateService(h: any): any {
        return this.monitorCreateCommon(h, `Target: Service metric (${h.monitor.metric})`);
    }

    monitorCreateConnectivity(h: any): any {
        return this.monitorCreateCommon(h, `Target: Connectivity (${h.monitor.scopes.join(", ")})`);
    }

    monitorUpdateCommon(h: any, target: string): any {
        const header: any = { title: `[${h.orgName}] Monitor ${h.monitor.name} is updated` };

        const sa :string[] = [];
        if (h.user) {
            sa.push(`Created by: ${h.user.screenName}`);
        }

        sa.push(target);

        const widget1 = [{ textParagraph: {text: sa.join("\n") } }];
        const sections: any = [{ widgets: widget1 }];

        if (h.monitor.memo) {
            const widget2 = [{ textParagraph: { text: h.monitor.memo } }];
            sections.push({ widgets: widget2 });
        }

        return this.googlechatCard(header, sections);
    }

    monitorUpdateHost(h: any): any {
        return this.monitorUpdateCommon(h, `Target: Host metric (${h.monitor.metric})`);
    }

    monitorUpdateExternal(h: any): any {
        return this.monitorUpdateCommon(h, `Target: External (${h.monitor.url})`);
    }

    monitorUpdateExpression(h: any): any {
        return this.monitorUpdateCommon(h, `Target: Expression (${h.monitor.expression})`);
    }

    monitorUpdateAnomalyDetection(h: any): any {
        return this.monitorUpdateCommon(h, `Target: Anomaly detection (${h.monitor.scopes.join(", ")})`);
    }

    monitorUpdateService(h: any): any {
        return this.monitorUpdateCommon(h, `Target: Service metric (${h.monitor.metric})`);
    }

    monitorUpdateConnectivity(h: any): any {
        return this.monitorUpdateCommon(h, `Target: Connectivity (${h.monitor.scopes.join(", ")})`);
    }

    monitorDeleteCommon(h: any, target: string): any {
        const header: any = { title: `[${h.orgName}] Monitor ${h.monitor.name} is deleted` };

        const sa :string[] = [];
        if (h.user) {
            sa.push(`Created by: ${h.user.screenName}`);
        }

        sa.push(target);

        const widget1 = [{ textParagraph: {text: sa.join("\n") } }];
        const sections: any = [{ widgets: widget1 }];

        if (h.monitor.memo) {
            const widget2 = [{ textParagraph: { text: h.monitor.memo } }];
            sections.push({ widgets: widget2 });
        }

        return this.googlechatCard(header, sections);
    }

    monitorDeleteHost(h: any): any {
        return this.monitorDeleteCommon(h, `Target: Host metric (${h.monitor.metric})`);
    }

    monitorDeleteExternal(h: any): any {
        return this.monitorDeleteCommon(h, `Target: External (${h.monitor.url})`);
    }

    monitorDeleteExpression(h: any): any {
        return this.monitorDeleteCommon(h, `Target: Expression (${h.monitor.expression})`);
    }

    monitorDeleteAnomalyDetection(h: any): any {
        return this.monitorDeleteCommon(h, `Target: Anomaly detection (${h.monitor.scopes.join(", ")})`);
    }

    monitorDeleteService(h: any): any {
        return this.monitorDeleteCommon(h, `Target: Service metric (${h.monitor.metric})`);
    }

    monitorDeleteConnectivity(h: any): any {
        return this.monitorDeleteCommon(h, `Target: Connectivity (${h.monitor.scopes.join(", ")})`);
    }

    post(json: string) {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        };

        if (process.env.GOOGLECHAT_WEBHOOK) {
            const url = process.env.GOOGLECHAT_WEBHOOK;
            const request = https.request(url, options);
            request.write(json);
            request.end();
        }
    }
}
