(function () {
  let currentLang = "vi";
  let selectedNodeId = "bigquery";
  let simTimer = null;

  const HOURLY_RATES = {
    cloudsql: 0.03,
    dataflow: 0.07,
    bigtable: 0.65,
    composer: 0.45
  };

  function renderInspector(nodeId) {
    selectedNodeId = nodeId;
    const data = window.PIPELINE_NODES[nodeId];
    if (!data) return;

    document.querySelectorAll(".node-card").forEach((card) => {
      card.classList.toggle("selected", card.dataset.node === nodeId);
    });

    document.getElementById("insp-icon").textContent = data.icon;
    document.getElementById("insp-title").textContent = data.title;
    document.getElementById("insp-tier").textContent = currentLang === "vi" ? data.tier_vi : data.tier_en;
    document.getElementById("insp-analogy").textContent = currentLang === "vi" ? data.analogy_vi : data.analogy_en;
    document.getElementById("insp-role").textContent = currentLang === "vi" ? data.role_vi : data.role_en;
    document.getElementById("insp-code").textContent = data.code;
    document.getElementById("insp-ui").textContent = currentLang === "vi" ? data.ui_vi : data.ui_en;

    const pdeList = document.getElementById("insp-pde");
    pdeList.innerHTML = "";
    const bullets = currentLang === "vi" ? data.pde_vi : data.pde_en;
    bullets.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      pdeList.appendChild(li);
    });
  }

  function clearSimHighlights() {
    document.querySelectorAll(".node-card").forEach((card) => {
      card.classList.remove("active-valid", "active-dlq", "active-batch");
    });
  }

  function runSimulation(type) {
    if (simTimer) clearInterval(simTimer);
    clearSimHighlights();

    const flow = window.SIMULATION_FLOWS[type];
    if (!flow) return;

    const steps = currentLang === "vi" ? flow.steps_vi : flow.steps_en;
    let idx = 0;

    function showStep(stepIndex) {
      clearSimHighlights();
      const step = steps[stepIndex];
      const card = document.querySelector(`.node-card[data-node="${step.node}"]`);
      if (card) {
        card.classList.add(flow.cssClass);
      }
      document.getElementById("sim-step-badge").textContent = step.badge;
      document.getElementById("sim-narrative").textContent = step.text;
      renderInspector(step.node);
    }

    showStep(0);
    simTimer = setInterval(() => {
      idx += 1;
      if (idx >= steps.length) {
        clearInterval(simTimer);
        simTimer = null;
        return;
      }
      showStep(idx);
    }, 1800);
  }

  function updateCostCalculator() {
    let total = 0.0;
    document.querySelectorAll(".lab-toggles input[type='checkbox']").forEach((cb) => {
      const flag = cb.dataset.flag;
      const isChecked = cb.checked;
      if (isChecked && HOURLY_RATES[flag]) {
        total += HOURLY_RATES[flag];
      }
      const nodeMap = {
        cloudsql: "node-cloudsql",
        dataflow: "node-dataflow",
        bigtable: "node-bigtable",
        composer: "node-orchestration"
      };
      const targetEl = document.getElementById(nodeMap[flag]);
      if (targetEl) {
        targetEl.classList.toggle("enabled-lab", isChecked);
      }
    });

    const costValue = document.getElementById("cost-value");
    const costDot = document.getElementById("cost-dot");
    if (total === 0) {
      costValue.textContent = currentLang === "vi" ? "$0.00 / giờ (An toàn 100%)" : "$0.00 / hr (100% Safe)";
      costDot.className = "pulse-dot green";
    } else {
      const perDay = (total * 24).toFixed(2);
      costValue.textContent = currentLang === "vi"
        ? `$${total.toFixed(2)} / giờ (~$${perDay}/ngày - Nhớ chạy make lab-off!)`
        : `$${total.toFixed(2)} / hr (~$${perDay}/day - Run make lab-off when done!)`;
      costDot.className = "pulse-dot amber";
    }
  }

  // Event Listeners
  document.querySelectorAll(".node-card").forEach((card) => {
    card.addEventListener("click", () => {
      if (simTimer) {
        clearInterval(simTimer);
        simTimer = null;
        clearSimHighlights();
      }
      renderInspector(card.dataset.node);
    });
  });

  document.querySelectorAll(".btn-sim").forEach((btn) => {
    btn.addEventListener("click", () => runSimulation(btn.dataset.sim));
  });

  document.querySelectorAll(".lab-toggles input[type='checkbox']").forEach((cb) => {
    cb.addEventListener("change", updateCostCalculator);
  });

  document.getElementById("btn-tour").addEventListener("click", () => {
    runSimulation("valid");
  });

  document.getElementById("btn-lang").addEventListener("click", () => {
    currentLang = currentLang === "vi" ? "en" : "vi";
    document.getElementById("app-title").textContent =
      currentLang === "vi"
        ? "Bản Đồ Trực Quan Hệ Thống Dữ Liệu GCP"
        : "Interactive GCP Data Pipeline Visualizer";
    document.getElementById("app-subtitle").textContent =
      currentLang === "vi"
        ? "Dành cho người mới bắt đầu: Click vào từng khối hoặc bấm nút Mô phỏng luồng dữ liệu"
        : "Beginner-friendly explorer: Click any component or run a live data-flow simulation";
    renderInspector(selectedNodeId);
    updateCostCalculator();
  });

  // Initial state
  renderInspector("bigquery");
  updateCostCalculator();
})();
