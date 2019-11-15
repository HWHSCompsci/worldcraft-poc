import * as BABYLON from "babylonjs";
import { GameUtils } from "./game-utils";

export class Game {

    private canvas: HTMLCanvasElement;
    private engine: BABYLON.Engine;
    private scene: BABYLON.Scene;
    private camera: BABYLON.ArcRotateCamera;
    private light: BABYLON.Light;

    constructor(canvasElement: string) {
        // Create canvas and engine
        this.canvas = ( document.getElementById(canvasElement) as HTMLCanvasElement);
        this.engine = new BABYLON.Engine(this.canvas, true);
    }

    /**
     * Creates the BABYLONJS Scene
     */
    public createScene(): void {
        this.scene = new BABYLON.Scene(this.engine);

        // Lights
        this.light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.scene);

        // Need a free camera for collisions
        const camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 10, -50), this.scene);
        camera.speed = 0.5;
        camera.attachControl(this.canvas, true);

        // Ground
        const ground = BABYLON.Mesh.CreatePlane("ground", 200, this.scene);
        const groundMaterial = new BABYLON.StandardMaterial("groundMat", this.scene);
        groundMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
        ground.material = groundMaterial;
        ground.material.backFaceCulling = false;
        ground.position = new BABYLON.Vector3(0, -1, 0);
        ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);

        const box = this.createBlock();

        // Set gravity for the scene (G force like, on Y-axis)
        this.scene.gravity = new BABYLON.Vector3(0, -0.9, 0);

        // Enable Collisions
        this.scene.collisionsEnabled = true;

        // Then apply collisions and gravity to the active camera
        camera.checkCollisions = true;
        camera.applyGravity = true;

        // Set the ellipsoid around the camera (e.g. your player's size)
        camera.ellipsoid = new BABYLON.Vector3(2, 2, 2);

        // finally, say which mesh will be collisionable
        ground.checkCollisions = true;
        box.checkCollisions = true;
    }

    /**
     * Starts the animation loop.
     */
    public animate(): void {

        // run the render loop
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        // the canvas/window resize event handler
        window.addEventListener("resize", () => {
            this.engine.resize();
        });
    }

    private createUVVector(x: number, y: number): any {
        const columns = 16;
        const rows = 16;
        y = rows - y;
        x = x - 1;
        return new BABYLON.Vector4(x / columns, y / rows, (x + 1) / columns, (y + 1) / rows);
    }

    private createBlock() {
        const mat = new BABYLON.StandardMaterial("mat", this.scene);
        const texture = new BABYLON.Texture("./assets/textures/blocks.png", this.scene);
        mat.diffuseTexture = texture;
        const faceUV = new Array(6);
        faceUV[0] = this.createUVVector(4, 1);
        faceUV[1] = this.createUVVector(4, 1);
        faceUV[2] = this.createUVVector(4, 1);
        faceUV[3] = this.createUVVector(4, 1);
        faceUV[4] = this.createUVVector(13, 13); // top
        faceUV[5] = this.createUVVector(3, 1); // bottom
        const options = {
            depth: 2,
            faceUV,
            height: 2,
            width: 2,
            wrap: true,
        };
        const box = BABYLON.MeshBuilder.CreateBox("box", options, this.scene);
        box.material = mat;
        box.position = new BABYLON.Vector3(0, 0, 0);
        return box;
    }

}
