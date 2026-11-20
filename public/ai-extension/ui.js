// ===== AI Extension: Begin =====
// Loaded only when the UI addition is enabled.
window.racetrackUI = {
    driverLabel: (name, carNumber) => `${name} · Car #${carNumber}`,
    renderResult(row, name, carNumber, lapCount, best) {
        row.replaceChildren()
        for (const [tag, value] of [
            ["strong", name],
            ["span", `Car #${carNumber}`],
            ["span", `Laps: ${lapCount}`],
            ["strong", best ? `Best: ${best}` : "No lap recorded"],
        ]) {
            const field = document.createElement(tag)
            field.textContent = value
            row.append(field)
        }
        row.classList.add("ai-result")
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const page = window.location.pathname
    if (page === "/front-desk" || page === "/race-control") {
        document.getElementById("status").textContent = "Enter access key"
        document.getElementById("login").classList.add("ai-login")
    }

    if (page !== "/") return
    const nav = document.querySelector("nav")
    const links = Array.from(nav.querySelectorAll("li"))
    nav.classList.add("ai-home")
    nav.replaceChildren()
    for (const [title, items] of [
        ["Staff Controls", links.slice(0, 3)],
        ["Public Displays", links.slice(3)],
    ]) {
        const section = document.createElement("section")
        const heading = document.createElement("h2")
        const list = document.createElement("ul")
        heading.textContent = title
        list.append(...items)
        section.append(heading, list)
        nav.append(section)
    }
})
// ===== AI Extension: End =====
