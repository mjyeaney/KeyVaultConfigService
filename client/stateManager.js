//
// Client-side state manager.
//

(function(scope){
    if (!scope.StateManager){
        scope.StateManager = {};
    }

    let currentVault = "",
     currentSetting = "";

    //
    // UI Event handlers
    //
    const updateCurrentState = function(currentLocationHash){
        
        // Parse state location
        let cmd = "",
            param = "";
        
        if (currentLocationHash !== ""){
            let parts = currentLocationHash.split('/');
            cmd = parts[1];
            param = parts[2];
        }

        // rest UI params
        ViewModel.ResetView();

        switch (cmd){
            case "listVaults":
                ViewModel.SetBusyState();
                ViewModel.SetTitle("Vaults");
                ServiceClient.GetVaults(ViewModel.RenderVaults, ViewModel.SetErrorState);
                break;
            case "settings":
                currentVault = param;
                currentSetting = "";    
                ViewModel.SetBusyState();
                ViewModel.SetTitle("Settings")
                ServiceClient.GetSettings(currentVault, 
                    ViewModel.RenderSettings, 
                    ViewModel.SetErrorState);
                break;
            case "setting":
                currentSetting = param;    
                ViewModel.SetBusyState();
                ViewModel.SetTitle("Edit Setting");
                ServiceClient.GetSettingValue(currentVault, 
                    currentSetting,
                    ViewModel.RenderSetting, 
                    ViewModel.SetErrorState);
                break;
            case "logStream":
                ViewModel.SetBusyState();
                ViewModel.SetTitle("LogStream");
                ServiceClient.GetLogStream(ViewModel.RenderLogStream, ViewModel.SetErrorState);
                break;
            case "cacheStats":
                ViewModel.SetBusyState();
                ViewModel.SetTitle("Cache Stats");
                ServiceClient.GetCacheStats(ViewModel.RenderCacheStats, ViewModel.SetErrorState);
                break;
            case "":
                $("p.getStarted").show();
                break;            
            default:
                $("p.unknown").show();
                break;
        }
    };

    const persistSettingEdits = function(){
        let newSetting = ViewModel.ReadSettingEditorVaules();

        ServiceClient.SaveSettingValue(currentVault,
            currentSetting,
            newSetting.Value,
            () => {
                history.go(-1);
            },
            (err) => {
                alert(err);
            });
    };

    const goPreviousState = () => {
        history.go(-1);
    };

    scope.StateManager.UpdateCurrentState = updateCurrentState;
    scope.StateManager.PersistSettingEdits = persistSettingEdits;
    scope.StateManager.GoPreviousState = goPreviousState;
})(this);