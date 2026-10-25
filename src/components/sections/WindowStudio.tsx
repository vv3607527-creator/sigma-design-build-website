"use client";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { ArrowUpRight, Rotate3d } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { SystemId } from "@/lib/film";

type StudioSystem = "sliding" | "casement" | "tilt-turn";

const studioSystems: {
  id: StudioSystem;
  index: string;
  label: string;
  meta: string;
  description: string;
}[] = [
  {
    id: "sliding",
    index: "01",
    label: "Sliding door",
    meta: "3400 × 2550 mm",
    description:
      "Two panels on a single flush track. One panel glides across the fixed light, so the opening is twice the clear width of a hinged door.",
  },
  {
    id: "casement",
    index: "02",
    label: "Casement window",
    meta: "3200 × 2000 mm",
    description:
      "Twin side-hung sashes that swing inward for full ventilation, with a central mullion and compression gaskets on every edge.",
  },
  {
    id: "tilt-turn",
    index: "03",
    label: "Tilt & turn",
    meta: "2500 × 2000 mm",
    description:
      "One sash that tilts from the top for secure ventilation and turns inward for cleaning — the quiet workhorse of upper floors.",
  },
];

const finishes = [
  { id: "obsidian", label: "Anodised obsidian", hex: "#24231f" },
  { id: "champagne", label: "Champagne metallic", hex: "#a98546" },
  { id: "chalk", label: "Chalk white", hex: "#d9d4c9" },
];

type Motion = {
  object: THREE.Object3D;
  home: number;
  open: number;
  property: "position.x" | "rotation.x" | "rotation.y";
};

export default function WindowStudio({
  onQuote,
  onSpec,
}: {
  onQuote: (system?: SystemId) => void;
  onSpec: (system?: SystemId) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const apiRef = useRef<{
    setSystem: (system: StudioSystem) => void;
    setFinish: (hex: string) => void;
    setOpen: (open: boolean) => void;
  } | null>(null);

  const [system, setSystem] = useState<StudioSystem>("sliding");
  const [finish, setFinish] = useState(finishes[0]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      setFailed(true);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.06;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0.08, 5.7);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = new RoomEnvironment();
    const envTexture = pmrem.fromScene(environment, 0.05).texture;
    scene.environment = envTexture;

    const ambient = new THREE.AmbientLight(0xfff4e2, 0.45);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xfff1d9, 3.1);
    key.position.set(4, 6, 6);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0xc9a45b, 2.4);
    rim.position.set(-5, 1, 3);
    scene.add(rim);

    const fill = new THREE.PointLight(0xffffff, 16, 14, 2);
    fill.position.set(0, -2.4, 3.4);
    scene.add(fill);

    const frameMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(finishes[0].hex),
      roughness: 0.4,
      metalness: 0.2,
      envMapIntensity: 1.1,
    });

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#cfe2de"),
      metalness: 0,
      roughness: 0.04,
      transparent: true,
      opacity: 0.24,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      envMapIntensity: 1.9,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const metalMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#c9a45b"),
      metalness: 0.9,
      roughness: 0.26,
      envMapIntensity: 1.4,
    });

    const recessMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#080808"),
      roughness: 0.95,
      metalness: 0,
    });

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minPolarAngle = Math.PI / 2 - 0.3;
    controls.maxPolarAngle = Math.PI / 2 + 0.22;
    controls.minAzimuthAngle = -0.42;
    controls.maxAzimuthAngle = 0.42;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    let root: THREE.Group | null = null;
    let motions: Motion[] = [];
    let currentSystem: StudioSystem = "sliding";
    let openState = false;

    const box = (
      width: number,
      height: number,
      depth: number,
      material: THREE.Material,
      x: number,
      y: number,
      z: number,
    ) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
      mesh.position.set(x, y, z);
      return mesh;
    };

    const build = (next: StudioSystem) => {
      if (root) {
        scene.remove(root);
        root.traverse((child) => {
          const mesh = child as THREE.Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
        });
      }

      root = new THREE.Group();
      motions = [];

      const isDoor = next === "sliding";
      const width = isDoor ? 3.4 : next === "casement" ? 3.2 : 2.5;
      const height = isDoor ? 2.55 : 2.0;
      const edge = isDoor ? 0.1 : 0.085;
      const depth = isDoor ? 0.17 : 0.13;
      const innerW = width - edge * 2;
      const innerH = height - edge * 2;

      root.add(
        box(width, edge, depth, frameMaterial, 0, height / 2 - edge / 2, 0),
        box(width, edge, depth, frameMaterial, 0, -height / 2 + edge / 2, 0),
        box(edge, innerH, depth, frameMaterial, -width / 2 + edge / 2, 0, 0),
        box(edge, innerH, depth, frameMaterial, width / 2 - edge / 2, 0, 0),
      );

      root.add(box(innerW, innerH, 0.012, recessMaterial, 0, 0, -depth / 2 + 0.01));

      if (next === "sliding") {
        const half = innerW / 2;
        const bar = 0.06;
        [1, -1].forEach((side) => {
          const panel = new THREE.Group();
          const homeX = (side * half) / 2;
          panel.position.set(homeX, 0, side * 0.028);

          const panelWidth = half - 0.01;
          panel.add(
            box(panelWidth, bar, 0.055, frameMaterial, 0, innerH / 2 - bar / 2, 0),
            box(panelWidth, bar, 0.055, frameMaterial, 0, -innerH / 2 + bar / 2, 0),
            box(bar, innerH - bar * 2, 0.055, frameMaterial, -panelWidth / 2 + bar / 2, 0, 0),
            box(bar, innerH - bar * 2, 0.055, frameMaterial, panelWidth / 2 - bar / 2, 0, 0),
            box(
              panelWidth - bar * 2,
              innerH - bar * 2,
              0.012,
              glassMaterial,
              0,
              0,
              0,
            ),
          );

          if (side === 1) {
            const handle = box(0.026, 0.42, 0.05, metalMaterial, -panelWidth / 2 + 0.055, -0.14, 0.055);
            panel.add(handle);
            motions.push({
              object: panel,
              home: homeX,
              open: homeX - half * 0.94,
              property: "position.x",
            });
          }

          root!.add(panel);
        });
      }

      if (next === "casement") {
        const half = innerW / 2;
        root.add(box(0.09, innerH, depth, frameMaterial, 0, 0, 0));

        [1, -1].forEach((side) => {
          const pivot = new THREE.Group();
          pivot.position.set((side * innerW) / 2, 0, 0);
          const sashWidth = half - 0.02;
          const bar = 0.06;

          const sash = new THREE.Group();
          sash.position.x = (-side * sashWidth) / 2;
          sash.add(
            box(sashWidth, bar, 0.07, frameMaterial, 0, innerH / 2 - bar / 2, 0),
            box(sashWidth, bar, 0.07, frameMaterial, 0, -innerH / 2 + bar / 2, 0),
            box(bar, innerH - bar * 2, 0.07, frameMaterial, -sashWidth / 2 + bar / 2, 0, 0),
            box(bar, innerH - bar * 2, 0.07, frameMaterial, sashWidth / 2 - bar / 2, 0, 0),
            box(sashWidth - bar * 2, innerH - bar * 2, 0.012, glassMaterial, 0, 0, 0),
            box(0.03, 0.34, 0.05, metalMaterial, -side * (sashWidth / 2 - 0.1), -0.1, 0.06),
          );

          pivot.add(sash);
          root!.add(pivot);
          motions.push({
            object: pivot,
            home: 0,
            open: side === 1 ? -0.52 : 0.52,
            property: "rotation.y",
          });
        });
      }

      if (next === "tilt-turn") {
        const pivot = new THREE.Group();
        pivot.position.y = -innerH / 2;
        const bar = 0.07;
        const sashWidth = innerW - 0.03;
        const sashHeight = innerH - 0.03;

        const sash = new THREE.Group();
        sash.position.y = innerH / 2;
        sash.add(
          box(sashWidth, bar, 0.075, frameMaterial, 0, sashHeight / 2 - bar / 2, 0),
          box(sashWidth, bar, 0.075, frameMaterial, 0, -sashHeight / 2 + bar / 2, 0),
          box(bar, sashHeight - bar * 2, 0.075, frameMaterial, -sashWidth / 2 + bar / 2, 0, 0),
          box(bar, sashHeight - bar * 2, 0.075, frameMaterial, sashWidth / 2 - bar / 2, 0, 0),
          box(sashWidth - bar * 2, sashHeight - bar * 2, 0.012, glassMaterial, 0, 0, 0),
          box(0.03, 0.36, 0.05, metalMaterial, sashWidth / 2 - 0.33, -0.12, 0.06),
        );

        pivot.add(sash);
        root.add(pivot);
        motions.push({ object: pivot, home: 0, open: 0.17, property: "rotation.x" });
      }

      scene.add(root);
      currentSystem = next;
    };

    build("sliding");
    setReady(true);

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.z = 5.7 * Math.max(1, 1.22 / (width / height));
      camera.updateProjectionMatrix();
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    let visible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 },
    );
    observer.observe(container);

    let autoTimer = 0;
    const pauseRotation = () => {
      controls.autoRotate = false;
      window.clearTimeout(autoTimer);
    };
    const resumeRotation = () => {
      window.clearTimeout(autoTimer);
      autoTimer = window.setTimeout(() => {
        controls.autoRotate = true;
      }, 4200);
    };
    canvas.addEventListener("pointerdown", pauseRotation);
    window.addEventListener("pointerup", resumeRotation);

    let raf = 0;
    const render = () => {
      raf = requestAnimationFrame(render);
      if (!visible) return;

      motions.forEach((motion) => {
        const target = openState ? motion.open : motion.home;
        const value =
          motion.property === "position.x"
            ? motion.object.position.x
            : motion.object.rotation[motion.property === "rotation.x" ? "x" : "y"];
        const nextValue = value + (target - value) * 0.1;
        if (motion.property === "position.x") {
          motion.object.position.x = nextValue;
        } else if (motion.property === "rotation.x") {
          motion.object.rotation.x = nextValue;
        } else {
          motion.object.rotation.y = nextValue;
        }
      });

      controls.update();
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(render);

    apiRef.current = {
      setSystem(next) {
        if (next === currentSystem) return;
        build(next);
        setReady(true);
      },
      setFinish(hex) {
        frameMaterial.color.set(hex);
      },
      setOpen(value) {
        openState = value;
      },
    };

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(autoTimer);
      observer.disconnect();
      resizeObserver.disconnect();
      canvas.removeEventListener("pointerdown", pauseRotation);
      window.removeEventListener("pointerup", resumeRotation);
      controls.dispose();
      if (root) {
        root.traverse((child) => {
          const mesh = child as THREE.Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
        });
      }
      frameMaterial.dispose();
      glassMaterial.dispose();
      metalMaterial.dispose();
      recessMaterial.dispose();
      envTexture.dispose();
      environment.dispose();
      pmrem.dispose();
      renderer.dispose();
      apiRef.current = null;
    };
  }, []);

  useEffect(() => {
    apiRef.current?.setSystem(system);
  }, [system]);

  useEffect(() => {
    apiRef.current?.setFinish(finish.hex);
  }, [finish]);

  useEffect(() => {
    apiRef.current?.setOpen(open);
  }, [open]);

  const active = studioSystems.find((item) => item.id === system) ?? studioSystems[0];

  return (
    <section
      id="studio"
      className="relative scroll-mt-24 overflow-hidden border-t border-offwhite/10 bg-obsidian py-24 md:py-32"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-champagne/[0.05] blur-[120px]" />
      <div className="shell relative">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <span className="eyebrow">03 — Window studio</span>
            <h2 className="display mt-6 text-[clamp(2.6rem,5.2vw,4.7rem)]">
              Compose
              <br />
              an <em>opening.</em>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="text-sm leading-relaxed text-offwhite/55">
              A live model of the systems we fabricate. Rotate it, change the finish, open the sash.
              Bring the configuration to us and we will price it against your actual opening.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div
              ref={containerRef}
              className="relative aspect-[4/3] w-full overflow-hidden border border-offwhite/10 sm:aspect-[5/4]"
              style={{
                background:
                  "radial-gradient(75% 80% at 50% 42%, #1a1916 0%, #101010 55%, #080808 100%)",
              }}
            >
              <canvas
                ref={canvasRef}
                className="studio-canvas h-full w-full"
                aria-label="Interactive 3D model of a Sigma uPVC system"
              />
              <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4 text-[9px] uppercase tracking-[0.24em] text-offwhite/40">
                <span>Live model · S/03</span>
                <span className="inline-flex items-center gap-2">
                  <Rotate3d className="h-3.5 w-3.5 text-champagne" />
                  Drag to rotate
                </span>
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-[9px] uppercase tracking-[0.22em] text-offwhite/35">
                <span>{active.meta}</span>
                <span>Sigma studio</span>
              </div>
              <div
                className={`pointer-events-none absolute inset-0 grid place-items-center bg-obsidian transition-opacity duration-700 ${
                  ready && !failed ? "opacity-0" : "opacity-100"
                }`}
              >
                {failed ? (
                  <p className="max-w-[240px] text-center text-[10px] uppercase leading-relaxed tracking-[0.2em] text-offwhite/40">
                    Interactive 3D is unavailable on this device. The specification is still open to
                    you.
                  </p>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <span className="h-7 w-7 animate-spin rounded-full border border-champagne/30 border-t-champagne" />
                    <span className="text-[9px] uppercase tracking-[0.28em] text-offwhite/35">
                      Building model
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-[9px] uppercase tracking-[0.2em] text-offwhite/25">
              <span>Illustrative model · final dimensions confirmed on site</span>
              <span className="hidden sm:block">Fig. 01</span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="flex h-full flex-col justify-between border border-offwhite/10 bg-carbon/50 p-6 backdrop-blur-sm md:p-7">
              <div>
                <p className="text-[10px] uppercase tracking-[0.26em] text-champagne">Configure</p>

                <div className="mt-5 border-y border-offwhite/10">
                  {studioSystems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSystem(item.id)}
                      aria-pressed={system === item.id}
                      className="group flex w-full items-center justify-between border-b border-offwhite/8 py-4 text-left last:border-0"
                    >
                      <span className="flex items-baseline gap-3">
                        <span
                          className={`font-display text-[10px] ${
                            system === item.id ? "text-champagne" : "text-offwhite/25"
                          }`}
                        >
                          {item.index}
                        </span>
                        <span
                          className={`font-display text-[1.15rem] transition-colors ${
                            system === item.id
                              ? "text-gold-light"
                              : "text-offwhite/65 group-hover:text-offwhite"
                          }`}
                        >
                          {item.label}
                        </span>
                      </span>
                      <span className="text-[9px] tracking-[0.14em] text-offwhite/30">
                        {item.meta}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-offwhite/40">
                      Finish
                    </p>
                    <p className="mt-1 text-[11px] text-offwhite/65">{finish.label}</p>
                  </div>
                  <div className="flex gap-2.5">
                    {finishes.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setFinish(item)}
                        aria-label={item.label}
                        aria-pressed={finish.id === item.id}
                        className={`h-9 w-9 rounded-full border-2 transition-all ${
                          finish.id === item.id
                            ? "border-gold-light ring-2 ring-champagne/20"
                            : "border-offwhite/15 hover:border-offwhite/40"
                        }`}
                        style={{ backgroundColor: item.hex }}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border border-offwhite/10 px-4 py-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-offwhite/45">
                      Operation
                    </p>
                    <p className="mt-0.5 text-[10px] text-offwhite/30">
                      {open ? "Open position" : "Closed & sealed"}
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={open}
                    onClick={() => setOpen((value) => !value)}
                    className={`relative h-6 w-11 rounded-full transition-colors duration-300 ${
                      open ? "bg-champagne" : "bg-offwhite/15"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-ink transition-all duration-300 ${
                        open ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                <p className="mt-6 text-[12px] leading-relaxed text-offwhite/45">
                  {active.description}
                </p>
              </div>

              <div className="mt-8">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => onQuote(active.id as SystemId)}
                    className="btn btn-gold flex-1"
                  >
                    Enquire about this system
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onSpec(active.id as SystemId)}
                    className="btn btn-outline"
                  >
                    Spec
                  </button>
                </div>
                <p className="mt-3 text-[9px] uppercase leading-relaxed tracking-[0.16em] text-offwhite/25">
                  Finish and operation are illustrative. Hardware options confirmed at specification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
