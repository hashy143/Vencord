/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";

export default definePlugin({
    name: "ExactTimestamps",
    description: "Shows exact message timestamps including seconds.",
    authors: [Devs.hashy143],

    options: {
        showSeconds: {
            type: OptionType.BOOLEAN,
            description: "Show time with seconds",
            default: true,
            restartNeeded: true
        },
        use24Hour: {
            type: OptionType.BOOLEAN,
            description: "Use 24-hour time format",
            default: true,
            restartNeeded: true
        }
    },

    patches: [
        {
            find: ".toISOString()",
            replacement: [
                {
                    match: /timeFormatted:(\i),.*?timestamp:(\i)/,
                    replace: "timeFormatted:$self.formatTime($1,$2),timestamp:$2"
                }
            ]
        }
    ],

    formatTime(defaultFormatted: string, timestamp: any) {
        if (!this.options.showSeconds || !timestamp) return defaultFormatted;

        try {
            const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
            if (isNaN(date.getTime())) return defaultFormatted;

            return date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: !this.options.use24Hour
            });
        } catch {
            return defaultFormatted;
        }
    }
});
