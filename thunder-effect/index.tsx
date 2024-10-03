"use client";

import * as React from "react";

import { cn } from "@/lib/utils/cn";

interface Lightning {
  x: number;
  y: number;
  xRange: number;
  yRange: number;
  path: { x: number; y: number }[];
  pathLimit: number;
  canSpawn: boolean;
  hasFired: boolean;
}

export function ThunderEffect({
  className,
  hueDeg,
}: {
  className?: string;
  hueDeg?: number;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  let ctx: CanvasRenderingContext2D | null = null;
  let cw: number = 0;
  let ch: number = 0;

  const applyBlueColor = hueDeg !== 0;

  React.useEffect(() => {
    const isCanvasSupported = (): boolean => {
      const elem = document.createElement("canvas");
      return !!(elem.getContext && elem.getContext("2d"));
    };

    const setupRAF = (): void => {
      let lastTime: number = 0;
      const vendors: string[] = ["ms", "moz", "webkit", "o"];
      for (
        let x: number = 0;
        x < vendors.length && !window.requestAnimationFrame;
        ++x
      ) {
        window.requestAnimationFrame =
          window[(vendors[x] + "RequestAnimationFrame") as keyof Window];
        window.cancelAnimationFrame =
          window[(vendors[x] + "CancelAnimationFrame") as keyof Window] ||
          window[(vendors[x] + "CancelRequestAnimationFrame") as keyof Window];
      }

      if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (
          callback: FrameRequestCallback
        ): number {
          const currTime: number = new Date().getTime();
          const timeToCall: number = Math.max(0, 16 - (currTime - lastTime));
          const id: number = window.setTimeout(function () {
            callback(currTime + timeToCall);
          }, timeToCall);
          lastTime = currTime + timeToCall;
          return id;
        };
      }

      if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id: number): void {
          clearTimeout(id);
        };
      }
    };

    const canvasLightning = function (
      c: HTMLCanvasElement,
      cw: number,
      ch: number
    ): void {
      let lightning: Lightning[] = [];
      let lightTimeCurrent: number = 0;
      let lightTimeTotal: number = 50;

      const init = (): void => {
        loop();
      };

      const rand = (rMi: number, rMa: number): number => {
        return ~~(Math.random() * (rMa - rMi + 1)) + rMi;
      };

      const createL = (x: number, y: number, canSpawn: boolean): void => {
        lightning.push({
          x: x,
          y: y,
          xRange: rand(5, 30),
          yRange: rand(5, 25),
          path: [{ x: x, y: y }],
          pathLimit: rand(10, 35),
          canSpawn: canSpawn,
          hasFired: false,
        });
      };

      const updateL = (): void => {
        let i: number = lightning.length;
        while (i--) {
          const light: Lightning = lightning[i];
          light.path.push({
            x:
              light.path[light.path.length - 1].x +
              (rand(0, light.xRange) - light.xRange / 2),
            y: light.path[light.path.length - 1].y + rand(0, light.yRange),
          });

          if (light.path.length > light.pathLimit) {
            lightning.splice(i, 1);
          }
          light.hasFired = true;
        }
      };

      const renderL = (): void => {
        let i: number = lightning.length;
        while (i--) {
          const light: Lightning = lightning[i];
          const baseBlue = "hsla(200, 100%, 50%, ";
          const baseWhite = "hsla(0, 100%, 100%, ";

          const lineColor = applyBlueColor
            ? `${baseBlue}${rand(10, 100) / 100})`
            : `${baseWhite}${rand(10, 100) / 100})`;

          const fillColor = applyBlueColor
            ? `${baseBlue}${rand(2, 8) / 100})`
            : `${baseWhite}${rand(4, 12) / 100})`;

          ctx!.strokeStyle = lineColor;
          ctx!.lineWidth = 1;
          if (rand(0, 30) == 0) {
            ctx!.lineWidth = 2;
          }
          if (rand(0, 60) == 0) {
            ctx!.lineWidth = 3;
          }
          if (rand(0, 90) == 0) {
            ctx!.lineWidth = 4;
          }
          if (rand(0, 120) == 0) {
            ctx!.lineWidth = 5;
          }
          if (rand(0, 150) == 0) {
            ctx!.lineWidth = 6;
          }

          ctx!.beginPath();

          const pathCount: number = light.path.length;
          ctx!.moveTo(light.x, light.y);
          for (let pc: number = 0; pc < pathCount; pc++) {
            ctx!.lineTo(light.path[pc].x, light.path[pc].y);

            if (light.canSpawn) {
              if (rand(0, 100) == 0) {
                light.canSpawn = false;
                createL(light.path[pc].x, light.path[pc].y, false);
              }
            }
          }

          if (!light.hasFired) {
            ctx!.fillStyle = fillColor;
            ctx!.fillRect(0, 0, cw, ch);
          }

          if (rand(0, 30) == 0) {
            ctx!.fillStyle = fillColor;
            ctx!.fillRect(0, 0, cw, ch);
          }

          ctx!.stroke();
        }
      };

      const lightningTimer = (): void => {
        lightTimeCurrent++;
        if (lightTimeCurrent >= lightTimeTotal) {
          const newX: number = rand(100, cw - 100);
          const newY: number = rand(0, ch / 2);
          let createCount: number = rand(1, 3);
          while (createCount--) {
            createL(newX, newY, true);
          }
          lightTimeCurrent = 0;
          lightTimeTotal = rand(100, 200);
        }
      };

      const clearCanvas = (): void => {
        ctx!.globalCompositeOperation = "destination-out";
        ctx!.fillStyle = "rgba(0,0,0," + rand(1, 30) / 100 + ")";
        ctx!.fillRect(0, 0, cw, ch);
        ctx!.globalCompositeOperation = "source-over";
      };

      const loop = (): void => {
        const loopIt = (): void => {
          requestAnimationFrame(loopIt);
          clearCanvas();
          updateL();
          lightningTimer();
          renderL();
        };
        loopIt();
      };

      init();
    };

    if (isCanvasSupported()) {
      const c: HTMLCanvasElement = canvasRef.current!;
      cw = c.width = window.innerWidth;
      ch = c.height = window.innerHeight;
      ctx = c.getContext("2d");
      // @ts-ignore
      new canvasLightning(c, cw, ch);

      setupRAF();
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="canvas"
      className={cn("fixed inset-0 h-full w-full", className)}
      style={{
        filter: applyBlueColor ? `hue-rotate(${hueDeg}deg)` : undefined,
      }}
    />
  );
}
