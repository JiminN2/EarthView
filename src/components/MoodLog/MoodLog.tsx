import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import cytoscape, { type ElementsDefinition, EdgeDefinition, type Core } from "cytoscape";
import styles from "./MoodLog.module.css";
import HeaderMoodLog from "./HeaderMoodLog.tsx";
import Sidebar from "./Sidebar.tsx";


type Mood = {
  label: string;
  color: string;
};


type NodeMoods = Record<string, Mood>;

export default function MoodLog() {
  const cyRef = useRef<HTMLDivElement | null>(null);
  
  const cyInstanceRef = useRef<Core | null>(null);

  const navigate = useNavigate();

  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const [nodeMoods, setNodeMoods] = useState<NodeMoods>({}); // 노드별 감정 상태를 저장하는 상태

//cytoscape 초기화 (마운트 시 1회 실행)
  useEffect(() => {
    if (!cyRef.current) return;

    function createPathEdges(pathIds: string[]) : EdgeDefinition[] {
  return pathIds.slice(0, -1).map((sourceId, index) => ({
    data: {
      id: `e_${sourceId}_${pathIds[index + 1]}`,
      source: sourceId,
      target: pathIds[index + 1]
    }
  }));
}


const paths = [
  ["n1", "n2", "n3", "n4", "n5", "n6", "n7", "n8", "n9", "n10", "n4"],
  ["n2", "n11", "n12"],
  ["n5", "n13", "n8"],
  ["n9", "n14", "n15", "n16", "n17"],
  ["n14", "n18", "n19"],
  ["n20", "n21", "n22", "n23", "n24"],
  ["n20", "n25", "n26", "n27", "n28", "n29", "n24", "n30"]
];

// paths 배열을 한 번에 순회하면서 모든 엣지를 하나로 합침
const edges = paths.flatMap(path => createPathEdges(path));


    const elements: ElementsDefinition = {
      nodes: [
        { data: { id: "n1" }, position: { x: 136, y: 137 } },
        { data: { id: "n2" }, position: { x: 112, y: 216 } },
        { data: { id: "n3" }, position: { x: 127, y: 273 } },
        { data: { id: "n4" }, position: { x: 151, y: 320 } },
        { data: { id: "n5" }, position: { x: 173, y: 434 } },
        { data: { id: "n6" }, position: { x: 147, y: 537 } },
        { data: { id: "n7" }, position: { x: 282, y: 519 } },
        { data: { id: "n8" }, position: { x: 244, y: 422 } },
        { data: { id: "n9" }, position: { x: 266, y: 345 } },
        { data: { id: "n10" }, position: { x: 236, y: 299 } },
        { data: { id: "n11" }, position: { x: 152, y: 207 } },
        { data: { id: "n12" }, position: { x: 189, y: 135 } },
        { data: { id: "n13" }, position: { x: 209, y: 426 } },
        { data: { id: "n14" }, position: { x: 393, y: 335 } },
        { data: { id: "n15" }, position: { x: 396, y: 367 } },
        { data: { id: "n16" }, position: { x: 398, y: 422 } },
        { data: { id: "n17" }, position: { x: 378, y: 457 } },
        { data: { id: "n18" }, position: { x: 392, y: 290 } },
        { data: { id: "n19" }, position: { x: 365, y: 260 } },
        { data: { id: "n20" }, position: { x: 615, y: 334 } },
        { data: { id: "n21" }, position: { x: 694, y: 300 } },
        { data: { id: "n22" }, position: { x: 755, y: 286 } },
        { data: { id: "n23" }, position: { x: 839, y: 269 } },
        { data: { id: "n24" }, position: { x: 1020, y: 152 } },
        { data: { id: "n25" }, position: { x: 714, y: 351 } },
        { data: { id: "n26" }, position: { x: 789, y: 389 } },
        { data: { id: "n27" }, position: { x: 881, y: 401 } },
        { data: { id: "n28" }, position: { x: 963, y: 408 } },
        { data: { id: "n29" }, position: { x: 989, y: 362 } },
        { data: { id: "n30" }, position: { x: 1026, y: 96 } },
      ],
      edges: edges
    };

    const cy: Core = cytoscape({
      container: cyRef.current,
      elements,
      style: [
        {
          selector: "node",
          style: {
            shape: "ellipse",
            "background-color": "white",
            color: "white",
            width: 20,
            height: 20,
            label: "data(id)",
          },
        },
      ],
      layout: {
        name: "preset",
      },
      zoomingEnabled: false,
      userZoomingEnabled: false,
      wheelSensitivity: 0,
      minZoom: 1,
      maxZoom: 1,
    });

    cyInstanceRef.current = cy;

    //node 클릭 이벤트 처리
    cy.on("tap", "node", (event) => {
      const nodeId = event.target.id();
      setSelectedNode(nodeId);
    });

    //node 바깥 클릭하면 사이드바 닫기
    cy.on("tap", (event) => {
      if (event.target === cy) {
        setSelectedNode(null);
      }
    });

    

      // 개발 모드에서만 사용할 좌표 추출 코드 예시
    cy.on('dragfree', 'node', () => {
      const positions = cy.nodes().map(node => ({
        id: node.id(),
        position: node.position()
      }));
      console.log("좌표:",JSON.stringify(positions)); // 이 출력값을 복사해서 데이터로 저장
    });


    return () => {
      cy.destroy();
      cyInstanceRef.current = null;
    };
  }, []);

  // nodeMoods가 변경될 때마다 Cytoscape 노드 색상 업데이트
  useEffect(() => {
    const cy = cyInstanceRef.current;
    if (!cy) return;

    Object.entries(nodeMoods).forEach(([nodeId, mood]) => {
      const node = cy.getElementById(nodeId);
      if (node) {
        node.style("background-color", mood.color);
      }
    });
  }, [nodeMoods]);

  return (
    <div className={styles.Container} >
      <div>
         <HeaderMoodLog />
      </div>
      <div className={styles.wrapper}>
        <div ref={cyRef} className={styles.cy} />
        <Sidebar selectedNode={selectedNode} />

        <button
          type="button"
          className={styles.backButton}
          aria-label="Go to previous page"
          onClick={() => navigate(-1)}
        >
          ←
        </button>
        
      </div>
      
    </div>
  );
}