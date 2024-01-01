$(function () {
  $('.note').before("<p class='admonition-title note'>Note</p>");
  $('.seealso').before("<p class='admonition-title seealso'>See also</p>");
  $('.warning').before("<p class='admonition-title warning'>Warning</p>");
  $('.caution').before("<p class='admonition-title caution'>Caution</p>");
  $('.attention').before("<p class='admonition-title attention'>Attention</p>");
  $('.tip').before("<p class='admonition-title tip'>Tip</p>");
  $('.important').before("<p class='admonition-title important'>Important</p>");
  $('.hint').before("<p class='admonition-title hint'>Hint</p>");
  $('.error').before("<p class='admonition-title error'>Error</p>");
  $('.danger').before("<p class='admonition-title danger'>Danger</p>");
});

$(document).ready(function () {

  // Shift nav in mobile when clicking the menu.
  $(document).on('click', "[data-toggle='wy-nav-top']", function () {
    $("[data-toggle='wy-nav-shift']").toggleClass("shift");
    $("[data-toggle='rst-versions']").toggleClass("shift");
  });
  // Close menu when you click a link.
  $(document).on('click', ".wy-menu-vertical .current ul li a", function () {
    $("[data-toggle='wy-nav-shift']").removeClass("shift");
    $("[data-toggle='rst-versions']").toggleClass("shift");
  });
  $(document).on('click', "[data-toggle='rst-current-version']", function () {
    $("[data-toggle='rst-versions']").toggleClass("shift-up");
  });
  // Make tables responsive
  $("table.docutils:not(.field-list)").wrap("<div class='wy-table-responsive'></div>");
});

$(document).ready(function () {
  $('#text-table-of-contents ul').first().addClass('nav');
  // ScrollSpy also requires that we use
  // a Bootstrap nav component.
  $('body').scrollspy({ target: '#text-table-of-contents' });

  // DON'T add sticky table headers (Fix issue #69?)
  // $('table').stickyTableHeaders();

  // set the height of tableOfContents
  var $postamble = $('#postamble');
  var $tableOfContents = $('#table-of-contents');
  $tableOfContents.css({ paddingBottom: $postamble.outerHeight() });

  // add TOC button
  var toggleSidebar = $('<div id="toggle-sidebar"><a href="#table-of-contents"><h2>Table of Contents</h2></a></div>');
  $('#content').prepend(toggleSidebar);

  // add close button when sidebar showed in mobile screen
  var closeBtn = $('<a class="close-sidebar" href="#">Close</a>');
  var tocTitle = $('#table-of-contents').find('h2');
  tocTitle.append(closeBtn);

  var href = false;

  const toc = document.getElementById("table-of-contents");
  const nav = document.createElement("nav");
  var postamble = document.getElementById("postamble");
  nav.id = "nav";
  if (toc) {
    nav.append(toc);
    nav.append(postamble);
  }
  document.getElementsByTagName("body")[0].prepend(nav);

  const slideout = new Slideout({
    panel: document.getElementById("content"),
    menu: document.getElementById("nav"),
    padding: 300,
    tolerance: 70,
  });

  slideout.on("close", function () {
    const content = document.getElementById("content");
    content.style.maxWidth = "860px";
    if (window.innerWidth > 768) {
      const offset = window.innerWidth - 300;
      content.style.maxWidth = offset >= 860 ? "860px" : offset + "px";
    } else {
      content.style.maxWidth = "860px";
    }
  });

  slideout.on("open", function () {
    console.log(href);
    if (href) href.scrollIntoView({ block: center });
    if (window.innerWidth > 768) {
      const content = document.getElementById("content");
      const offset = window.innerWidth - 300;
      content.style.maxWidth = offset >= 860 ? "860px" : offset + "px";
    }
  });

  const manageSlideoutBasedOnScreenWidth = () => {
    if (window.innerWidth > 768) {
      const content = document.getElementById("content");
      const offset = window.innerWidth - 300;
      content.style.maxWidth = offset >= 860 ? "860px" : offset + "px";
      slideout.open();
    } else {
      content.style.maxWidth = "860px";
      slideout.close();
    }
  };

  window.addEventListener("resize", manageSlideoutBasedOnScreenWidth);
  window.addEventListener("load", manageSlideoutBasedOnScreenWidth);

  textToc = document.getElementById("text-table-of-contents");
  if (textToc) {
    const list = textToc.getElementsByTagName("ul")[0];
    if (list) {
      Array.from(list.getElementsByTagName("li")).forEach((el) => {
        el.getElementsByTagName("a")[0].addEventListener("click", (e) => {
          e.preventDefault();
          const oldDuration = slideout._duration;
          slideout._duration = 1;
          manageSlideoutBasedOnScreenWidth();
          slideout._duration = oldDuration;
          const clickedHrefId = el.firstChild.getAttribute("href");
          href = $(clickedHrefId)[0];
          if (window.innerWidth > 768) {
            href.scrollIntoView();
            href = false;
            slideout.open();
          }
        });
      });
    }
  }

  window.addEventListener("transitionend", () => {
    if (href) {
      href.scrollIntoView({ block: "center" });
      href = false;
    }
  });


  if (document.getElementById('table-of-contents')) {
    document.getElementById('table-of-contents').style.display = "block"
  }

});

if ('serviceWorker' in navigator) {
  console.log("registering service worker")
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/serviceWorker.js');
  });
}

window.SphinxRtdTheme = (function (jquery) {
  var stickyNav = (function () {
    var navBar,
      win,
      stickyNavCssClass = 'stickynav',
      applyStickNav = function () {
        if (navBar.height() <= win.height()) {
          navBar.addClass(stickyNavCssClass);
        } else {
          navBar.removeClass(stickyNavCssClass);
        }
      },
      enable = function () {
        applyStickNav();
        win.on('resize', applyStickNav);
      },
      init = function () {
        navBar = jquery('nav.wy-nav-side:first');
        win = jquery(window);
      };
    jquery(init);
    return {
      enable: enable
    };
  }());
  return {
    StickyNav: stickyNav
  };
}($));
