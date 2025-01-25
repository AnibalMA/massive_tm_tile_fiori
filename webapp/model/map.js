sap.ui.define([], function () {
    "use strict";
    return {
        fnGetTileJson: function (row) {
            return {
                pageId: `X-SAP-UI2-CATALOGPAGE:${row.ID_CATALOG?.toString().trim()}`,
                instanceId: ``,
                chipId: `X-SAP-UI2-CHIP:/UI2/STATIC_APPLAUNCHER`,
                title: `${row.TITLE_TILE?.toString().trim() || ""}`,
                configuration: JSON.stringify({
                    tileConfiguration: JSON.stringify({
                        display_icon_url: `${row.ICON_TILE?.toString().trim() || ""}`,
                        navigation_use_semantic_object: true,
                        navigation_target_url: `#${row.SEMANTIC_OBJECT?.toString().trim() || ""}-${row.ACTION?.toString().trim() || ""}`,
                        navigation_semantic_object: `${row.SEMANTIC_OBJECT?.toString().trim() || ""}`,
                        navigation_semantic_action: `${row.ACTION?.toString().trim() || ""}`,
                        navigation_semantic_parameters: ``,
                        display_search_keywords: `${row.KEYWORDS?.toString().trim() || ""}`,
                        display_title_text: `${row.TITLE_TILE?.toString().trim() || ""}`,
                        display_subtitle_text: `${row.SUBTITLE_TILE?.toString().trim() || ""}`,
                        display_info_text: `${row.INFORMATION_TILE?.toString().trim() || ""}`
                    })
                }),
                layoutData: ``,
                remoteCatalogId: ``,
                referencePageId: ``,
                referenceChipInstanceId: ``,
                isReadOnly: ``,
                scope: `CONFIGURATION`,
                updated: new Date(),
                outdated: ``
            };
        },
        fnGetTMJson: function (row) {
            return {
                pageId: `X-SAP-UI2-CATALOGPAGE:${row.ID_CATALOG?.toString().trim()}`,
                instanceId: ``,
                chipId: `X-SAP-UI2-CHIP:/UI2/STATIC_APPLAUNCHER`,
                title: `${row.TITLE_TILE?.toString().trim() || ""}`,
                configuration: JSON.stringify({
                    tileConfiguration: JSON.stringify({
                        display_icon_url: `${row.ICON_TILE?.toString().trim() || ""}`,
                        navigation_use_semantic_object: true,
                        navigation_target_url: `#${row.SEMANTIC_OBJECT?.toString().trim() || ""}-${row.ACTION?.toString().trim() || ""}`,
                        navigation_semantic_object: `${row.SEMANTIC_OBJECT?.toString().trim() || ""}`,
                        navigation_semantic_action: `${row.ACTION?.toString().trim() || ""}`,
                        navigation_semantic_parameters: ``,
                        display_search_keywords: `${row.KEYWORDS?.toString().trim() || ""}`,
                        display_title_text: `${row.TITLE_TILE?.toString().trim() || ""}`,
                        display_subtitle_text: `${row.SUBTITLE_TILE?.toString().trim() || ""}`,
                        display_info_text: `${row.INFORMATION_TILE?.toString().trim() || ""}`
                    })
                }),
                layoutData: ``,
                remoteCatalogId: ``,
                referencePageId: ``,
                referenceChipInstanceId: ``,
                isReadOnly: ``,
                scope: `CONFIGURATION`,
                updated: new Date(),
                outdated: ``
            };
        }
    };
});