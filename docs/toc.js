// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><a href="introduction.html"><strong aria-hidden="true">1.</strong> Treacherous Winds</a></li><li class="chapter-item expanded "><a href="game.html"><strong aria-hidden="true">2.</strong> The Game</a></li><li class="chapter-item expanded "><a href="characters.html"><strong aria-hidden="true">3.</strong> Character Creation</a></li><li class="chapter-item expanded "><a href="setting-the-setting.html"><strong aria-hidden="true">4.</strong> Setting the Setting</a></li><li class="chapter-item expanded "><a href="common-moves.html"><strong aria-hidden="true">5.</strong> Common Moves</a></li><li class="chapter-item expanded "><a href="playbooks.html"><strong aria-hidden="true">6.</strong> Playbooks</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="playbooks/fighter.html"><strong aria-hidden="true">6.1.</strong> Fighter</a></li><li class="chapter-item expanded "><a href="playbooks/rogue.html"><strong aria-hidden="true">6.2.</strong> Rogue</a></li><li class="chapter-item expanded "><a href="playbooks/bard.html"><strong aria-hidden="true">6.3.</strong> Bard</a></li><li class="chapter-item expanded "><a href="playbooks/ranger.html"><strong aria-hidden="true">6.4.</strong> Ranger</a></li><li class="chapter-item expanded "><a href="playbooks/paladin.html"><strong aria-hidden="true">6.5.</strong> Paladin</a></li><li class="chapter-item expanded "><a href="playbooks/sorcerer.html"><strong aria-hidden="true">6.6.</strong> Sorcerer</a></li></ol></li><li class="chapter-item expanded "><a href="allignment.html"><strong aria-hidden="true">7.</strong> Allignment</a></li><li class="chapter-item expanded "><a href="background.html"><strong aria-hidden="true">8.</strong> Background</a></li><li class="chapter-item expanded "><a href="magic.html"><strong aria-hidden="true">9.</strong> Magic</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="magic/arcane.html"><strong aria-hidden="true">9.1.</strong> Arcane</a></li><li class="chapter-item expanded "><a href="magic/divine.html"><strong aria-hidden="true">9.2.</strong> Divine</a></li><li class="chapter-item expanded "><a href="magic/natural.html"><strong aria-hidden="true">9.3.</strong> Natural</a></li></ol></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
