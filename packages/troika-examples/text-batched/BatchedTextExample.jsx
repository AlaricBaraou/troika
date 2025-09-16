import React from "react";
import { BoxGeometry, Mesh, MeshBasicMaterial, MeshStandardMaterial } from "three";
import { Canvas3D } from "troika-3d";
import { Text3DFacade, BatchedText3DFacade } from "troika-3d-text";
import { Object3DFacade } from "../../troika-3d/src/index";

// Define the source text array once, so both 3D and SVG can use it
const words = [
  "One", "Two", "Three", "Four", "Five",
  "Six", "Seven", "Eight", "Nine", "Ten",
  "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
  "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty"
];

// This function generates the properties for the 3D text
function generate3DTextLayout(premultiply) {
  const startY = 1.5;
  const yStep = 0.15;
  const startFontSize = 0.3;
  const fontSizeStep = 0.012;

  return words.map((text, i) => ({
    facade: Text3DFacade,
    text,
    font: '/Geist-Regular.ttf',
    fontSize: Math.max(0.02, startFontSize - i * fontSizeStep),
    anchorX: "50%",
    anchorY: "50%",
    x: premultiply ? 1 : -1,
    y: startY - i * yStep,
    z: 0,
    // color: 0xc4c4c4,
    // color: 0xd0d0d0,
    color: 0x808080,
    fillOpacity: 0.5,
    // fillOpacity: 0.9375,
    outlineWidth: '10%',
    outlineColor: 0x121212,
    outlineOpacity: 1,
    usePremultipliedAlpha: !!premultiply,
  }));
}

class BackgroundTest extends Object3DFacade {
  initThreeObject() {
    return new Mesh(
      new BoxGeometry(10,1,1),
      new MeshBasicMaterial({
        color: 0xff0000,
      })
    )
  }
}


export default function BatchedTextExample({ stats, width, height }) {
  const [texts3D,setTexts] = React.useState(generate3DTextLayout());
  const [premultipliedTexts3D,setPremultipliedTexts] = React.useState(generate3DTextLayout(true));

  console.log('texts3D', texts3D)

  // --- SVG Text Logic ---
  // Define layout parameters suitable for SVG pixels
  const svgStartY = 60;          // Starting Y position in pixels
  const svgYStep = 20;           // Gap between lines in pixels
  const svgStartFontSize = 32;   // Starting font size in pixels
  const svgFontSizeStep = 1;     // How much to decrease font size (px)

  // Generate the properties for the SVG text elements
  const svgTexts = words.map((text, i) => ({
    text,
    y: svgStartY + i * svgYStep,
    fontSize: Math.max(8, svgStartFontSize - i * svgFontSizeStep),
  }));

  return (
    // Main container using Flexbox for a side-by-side layout
    <div style={{ display: 'flex', width, height, backgroundColor: '#ffffff' }}>

      {/* Add a style tag to load the custom font for the SVG */}
      <style>{`
        @font-face {
          font-family: 'Geist';
          src: url('/Geist-Regular.ttf') format('truetype');
        }
      `}</style>

      {/* 1. 3D Canvas Container (takes up the left 50%) */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <Canvas3D
          antialias
          stats={stats}
          width={width / 2} // Canvas now takes half the total width
          height={height}
          continuousRender={true}
          onBackgroundClick={() => {
            setTexts(generate3DTextLayout());
            setPremultipliedTexts(generate3DTextLayout(true));
          }}
          camera={{ fov: 75, aspect: (width / 2) / height, x: 0, y: 0, z: 2.5 }}
          objects={[
            {
              facade: BatchedText3DFacade,
              children: texts3D,
            },
            {
              facade: BatchedText3DFacade,
              children: premultipliedTexts3D,
            },
            {
              key: 'jnjn',
              facade: BackgroundTest,
              receiveShadow: true,
              scale: 1,
              z:-1,
              y:-1.4,
            }
          ]}
        />
      </div>

      {/* 2. SVG Container (takes up the right 50%) */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' }}>
        <svg width="80%" height="90%" viewBox="0 0 300 500">
          <rect x="0" y="67.5%" width="100%" height="25%" fill="#ff0000" stroke="#ff0000" strokeWidth="2" />
          {svgTexts.map((item, i) => (
            <text
              key={i}
              x="50%" // Center text horizontally
              y={item.y}
              fontFamily="Geist, sans-serif" // Apply the custom font
              fontSize={item.fontSize}
              textAnchor="middle" // SVG property to honor x="50%" as center
              fill="#808080"
              fillOpacity="0.5"
              paint-order="stroke"
              stroke="#121212"
              strokeOpacity="1"
              strokeWidth={item.fontSize * 0.2} // 10% of font size
            >
              {item.text}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}