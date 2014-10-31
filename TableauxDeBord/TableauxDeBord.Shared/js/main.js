//document.addEventListener("DOMContentLoaded", startGame, false);

function startGame() {
    if (BABYLON.Engine.isSupported()) {
        var canvas = document.getElementById("renderCanvas");
        var engine = new BABYLON.Engine(canvas, true);

        var scene;
        var currentCameraType = 0;
        var currentRenderingType = 0;

        window.addEventListener("resize", onResize, false);

        // Displayed while loading the scene
        var workInProgressElement = document.getElementsByClassName("workInProgress")[0];

        BABYLON.SceneLoader.Load("Spaceship/", "Spaceship.babylon", engine, function (newScene) {
            scene = newScene;
            // Wait for textures and shaders to be ready
            newScene.executeWhenReady(function () {
                // Attach camera to canvas inputs
                newScene.activeCamera.attachControl(canvas);

                WinJS.Utilities.addClass(workInProgressElement, "hidden");

                switchCamera(0);

                // Once the scene is loaded, just register a render loop to render it
                engine.runRenderLoop(function () {
                    newScene.render();
                });
            });
        }, function (progress) {
            // To do: give progress feedback to user
        });

        function onResize() {
            canvas.width = canvas.clientWidth;
        };

        // Called from settingFlyout.html 
        var switchCamera = function (cameraType) {
            if (!scene) {
                return;
            }

            var camera;
            currentCameraType = cameraType;

            switch (cameraType) {
                case 0:
                    // Called from the setting flyout to control the camera with keyboard & mouse
                    //camera = new BABYLON.FreeCamera("freeCamera", scene.activeCamera.position, scene);
                    camera = new BABYLON.ArcRotateCamera("freeCamera",0,Math.PI/2,5000, BABYLON.Vector3.Zero(), scene);
                    break;
                case 1:
                    // Called from the setting flyout to control the camera with touch
                    camera = new BABYLON.TouchCamera("touchCamera", scene.activeCamera.position, scene);
                    break;
                case 2:
                    // Called from the setting flyout to control the camera with the sensors of the device
                    camera = new BABYLON.DeviceOrientationCamera("deviceOrientationCamera", scene.activeCamera.position, scene);
                    break;
            }
            
            if (scene.activeCamera.rotation) {
                camera.rotation = scene.activeCamera.rotation.clone();
            }
            camera.fov = scene.activeCamera.fov;
            camera.minZ = scene.activeCamera.minZ;
            camera.maxZ = scene.activeCamera.maxZ;

            if (scene.activeCamera.ellipsoid) {
                camera.ellipsoid = scene.activeCamera.ellipsoid.clone();
            }
            camera.checkCollisions = scene.activeCamera.checkCollisions;
            camera.applyGravity = scene.activeCamera.applyGravity;

            camera.speed = scene.activeCamera.speed;

            camera.postProcesses = scene.activeCamera.postProcesses;
            scene.activeCamera.postProcesses = [];
            scene.activeCamera.detachControl(canvas);

            scene.activeCamera = camera;

            scene.activeCamera.attachControl(canvas);
        };

        // Called from the setting flyout to set back the rendering to full color
        var switchToNormalRendering = function () {
            cleanPostProcesses();
            currentRenderingType = 0;
        };

        // Called from the setting flyout to set the rendering into B&W
        var switchToBWRendering = function () {
            cleanPostProcesses();
            scene.activeCamera.__bandw_cookie = new BABYLON.BlackAndWhitePostProcess("bandw", 1.0, scene.activeCamera);
            currentRenderingType = 1;
        };

        // Called from the setting flyout to set the rendering into Sepia
        var switchToSepiaRendering = function () {
            cleanPostProcesses();
            var sepiaKernelMatrix = BABYLON.Matrix.FromValues(
                0.393, 0.349, 0.272, 0,
                0.769, 0.686, 0.534, 0,
                0.189, 0.168, 0.131, 0,
                0, 0, 0, 0
            );
            scene.activeCamera.__sepia_cookie = new BABYLON.ConvolutionPostProcess("Sepia", sepiaKernelMatrix, 1.0, scene.activeCamera);
            currentRenderingType = 2;
        };

        var cleanPostProcesses = function () {
            if (scene && scene.activeCamera) {
                if (scene.activeCamera.__bandw_cookie) {
                    scene.activeCamera.__bandw_cookie.dispose(),
                    scene.activeCamera.__bandw_cookie = null;
                }
                if (scene.activeCamera.__sepia_cookie) {
                    scene.activeCamera.__sepia_cookie.dispose(),
                    scene.activeCamera.__sepia_cookie = null;
                }
            }
        };

        // Called by settings panel to populate the current values of the settings
        var getSettings = function () {
            for (var i = 0; i < settingCameraType.length; i++) {
                if (settingCameraType[i].value === "" + currentCameraType) {
                    settingCameraType[i].checked = true;
                }
            }
            for (var i = 0; i < renderingType.length; i++) {
                if (renderingType[i].value === "" + currentRenderingType) {
                    renderingType[i].checked = true;
                }
            }
        };

        // Using WinJS Namespace to expose public logic
        WinJS.Namespace.define("GameManager", {
            switchCamera: switchCamera,
            switchToNormalRendering: switchToNormalRendering,
            switchToBWRendering: switchToBWRendering,
            switchToSepiaRendering: switchToSepiaRendering,
            getSettings: getSettings
        });
    }
}