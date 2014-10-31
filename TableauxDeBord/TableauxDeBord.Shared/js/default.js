// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    // Preferences panel
    function showPreferences() {
        WinJS.UI.SettingsFlyout.show();
    }

    // Notification before App Bar or Settings are shown/hidden
    function onBeforeShow(e) {
        if (e.srcElement.id === "settingsDiv") {
            // Sync up the settings UI to match internal state
            GameManager.getSettings();
        }
    }

    WinJS.Application.onsettings = function (e) {
        e.detail.applicationcommands = {
            "settingsDiv": { title: "Game options", href: "/html/settingsFlyout.html" }
        };
        WinJS.UI.SettingsFlyout.populateSettings(e);
    };

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }
            args.setPromise(WinJS.UI.processAll().then(startGame));
        }
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().
    };

    document.addEventListener("beforeshow", onBeforeShow, false);

    app.start();

    WinJS.Namespace.define("GameManager", {
        showPreferences: showPreferences
    });

})();
