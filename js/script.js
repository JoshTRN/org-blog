$(function () {
  $('.note').before("<p class='admonition-title note'>Note</p>")
  $('.seealso').before("<p class='admonition-title seealso'>See also</p>")
  $('.warning').before("<p class='admonition-title warning'>Warning</p>")
  $('.caution').before("<p class='admonition-title caution'>Caution</p>")
  $('.attention').before("<p class='admonition-title attention'>Attention</p>")
  $('.tip').before("<p class='admonition-title tip'>Tip</p>")
  $('.important').before("<p class='admonition-title important'>Important</p>")
  $('.hint').before("<p class='admonition-title hint'>Hint</p>")
  $('.error').before("<p class='admonition-title error'>Error</p>")
  $('.danger').before("<p class='admonition-title danger'>Danger</p>")
})

$(document).ready(function () {
  // Step 1: Replace `src` with `data-src`
  $('iframe').each(function () {
    const $iframe = $(this);
    const src = $iframe.attr('src');
    $iframe.attr('data-src', src);
    $iframe.removeAttr('src');
  });

  // Step 2: Use Intersection Observer to load iframes when they come into view
  const lazyIframes = $('iframe[data-src]');

  // Setting `src` on an iframe that is already in the document navigates it,
  // and a nested navigation pushes an entry onto the joint session history.
  // Scrolling past three videos meant three presses of Back to leave the day.
  // A fresh iframe whose src is set before it is inserted loads by
  // replacement instead, so history is left alone.
  const loadIframe = function (iframe) {
    const replacement = iframe.cloneNode(false);
    replacement.removeAttribute('data-src');
    replacement.src = iframe.getAttribute('data-src');
    iframe.replaceWith(replacement);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
          loadIframe(entry.target);
        }
      });
    });

    lazyIframes.each(function () {
      observer.observe(this);
    });
  } else {
    // Fallback for browsers that do not support IntersectionObserver
    lazyIframes.each(function () {
      loadIframe(this);
    });
  }


});


$(document).ready(function () {

  // Shift nav in mobile when clicking the menu.
  $(document).on('click', "[data-toggle='wy-nav-top']", function () {
    $("[data-toggle='wy-nav-shift']").toggleClass("shift")
    $("[data-toggle='rst-versions']").toggleClass("shift")
  })
  // Close menu when you click a link.
  $(document).on('click', ".wy-menu-vertical .current ul li a", function () {
    $("[data-toggle='wy-nav-shift']").removeClass("shift")
    $("[data-toggle='rst-versions']").toggleClass("shift")
  })
  $(document).on('click', "[data-toggle='rst-current-version']", function () {
    $("[data-toggle='rst-versions']").toggleClass("shift-up")
  })
  // Make tables responsive
  $("table.docutils:not(.field-list)").wrap("<div class='wy-table-responsive'></div>")
})

$(document).ready(function () {

  $('#shareBtn').click(function () {
    const shareText = 'Check this out!'
    const shareUrl = window.location.href

    if (navigator.share) {
      // For mobile devices
      navigator.share({
        title: shareText,
        url: shareUrl
      })
        .then(() => console.log('Share successful'))
        .catch((error) => console.error('Error sharing:', error))
    } else {
      // For web browsers
      const textarea = $('<textarea>').val(shareUrl).appendTo('body')
      textarea.select()
      document.execCommand('copy')
      textarea.remove()
      alert('Link copied to clipboard!')
    }
  })

  $('#text-table-of-contents ul').first().addClass('nav')
  // ScrollSpy also requires that we use
  // a Bootstrap nav component.
  $('body').scrollspy({ target: '#text-table-of-contents' })

  // DON'T add sticky table headers (Fix issue #69?)
  // $('table').stickyTableHeaders()

  // set the height of tableOfContents
  var $postamble = $('#postamble')
  var $tableOfContents = $('#table-of-contents')
  $tableOfContents.css({ paddingBottom: $postamble.outerHeight() })

  // add TOC button
  var toggleSidebar = $('<div id="toggle-sidebar"><a href="#table-of-contents"><h2>Table of Contents</h2></a></div>')
  $('#content').prepend(toggleSidebar)

  // add close button when sidebar showed in mobile screen
  var closeBtn = $('<a class="close-sidebar" href="#">Close</a>')
  var tocTitle = $('#table-of-contents').find('h2')
  tocTitle.append(closeBtn)

  var href = false

  const toc = document.getElementById("table-of-contents")
  const nav = document.createElement("nav")
  var postamble = document.getElementById("postamble")
  nav.id = "nav"
  if (toc) {
    nav.append(toc)
    nav.append(postamble)
  }
  document.getElementsByTagName("body")[0].prepend(nav)

  const slideout = new Slideout({
    panel: document.getElementById("content"),
    menu: document.getElementById("nav"),
    padding: 300,
    tolerance: 70,
  })

  slideout.on("close", function () {
    const content = document.getElementById("content")
    content.style.maxWidth = "860px"
    if (window.innerWidth > 768) {
      const offset = window.innerWidth - 300
      content.style.maxWidth = offset >= 860 ? "860px" : offset + "px"
    } else {
      content.style.maxWidth = "860px"
    }
  })

  slideout.on("open", function () {
    if (href) href.scrollIntoView({ block: center })
    if (window.innerWidth > 768) {
      const content = document.getElementById("content")
      const offset = window.innerWidth - 300
      content.style.maxWidth = offset >= 860 ? "860px" : offset + "px"
    }
  })

  const manageSlideoutBasedOnScreenWidth = () => {
    if (window.innerWidth > 768) {
      const content = document.getElementById("content")
      const offset = window.innerWidth - 300
      content.style.maxWidth = offset >= 860 ? "860px" : offset + "px"
      slideout.open()
    } else {
      content.style.maxWidth = "860px"
      slideout.close()
    }
  }

  window.addEventListener("resize", manageSlideoutBasedOnScreenWidth)
  window.addEventListener("load", manageSlideoutBasedOnScreenWidth)

  textToc = document.getElementById("text-table-of-contents")
  if (textToc) {
    const list = textToc.getElementsByTagName("ul")[0]
    if (list) {
      Array.from(list.getElementsByTagName("li")).forEach((el) => {
        el.getElementsByTagName("a")[0].addEventListener("click", (e) => {
          e.preventDefault()
          const oldDuration = slideout._duration
          slideout._duration = 1
          manageSlideoutBasedOnScreenWidth()
          slideout._duration = oldDuration
          const clickedHrefId = el.firstChild.getAttribute("href")
          href = $(clickedHrefId)[0]
          if (window.innerWidth > 768) {
            href.scrollIntoView()
            href = false
            slideout.open()
          }
        })
      })
    }
  }

  window.addEventListener("transitionend", () => {
    if (href) {
      href.scrollIntoView({ block: "center" })
      href = false
    }
  })

  if (document.getElementById('table-of-contents'))
    document.getElementById('table-of-contents').style.display = "block"
})

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/serviceWorker.js')
    // The old worker lived under /js/, so its scope was /js/ and it
    // controlled no page on the site. Drop any registration a device is
    // still holding for it.
    navigator.serviceWorker.getRegistrations().then((registrations) =>
      registrations
        .filter((registration) => registration.scope.endsWith('/js/'))
        .forEach((registration) => registration.unregister()))
  })
}

window.SphinxRtdTheme = (function (jquery) {
  var stickyNav = (function () {
    var navBar,
      win,
      stickyNavCssClass = 'stickynav',
      applyStickNav = function () {
        if (navBar.height() <= win.height()) {
          navBar.addClass(stickyNavCssClass)
        } else {
          navBar.removeClass(stickyNavCssClass)
        }
      },
      enable = function () {
        applyStickNav()
        win.on('resize', applyStickNav)
      },
      init = function () {
        navBar = jquery('nav.wy-nav-side:first')
        win = jquery(window)
      }
    jquery(init)
    return {
      enable: enable
    }
  }())
  return { StickyNav: stickyNav }
}($))

$(document).ready(function () {
  const style = document.createElement("style");
  style.innerHTML = `
  #imageModal {
    display: none;
    position: fixed;
    z-index: 2147483647;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
  }
  #imageModalClose, #imageModalPrev, #imageModalNext {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: #fff;
    font-size: 3rem;
    font-weight: bold;
    cursor: pointer;
    user-select: none;
    padding: 0 15px;
    background: rgba(0,0,0,0.3);
    display: block;
  }
  #imageModalClose {
    top: 10px;
    right: 20px;
    transform: none;
    font-size: 2.5rem;
  }
  #imageModalPrev { left: 20px; }
  #imageModalNext { right: 20px; }
  #imageModalContent {
    display: block;
    max-width: 90%;
    max-height: 90%;
    margin: auto;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }
`;
  document.head.appendChild(style);
  const modal = document.createElement("div");
  modal.id = "imageModal";
  const closeBtn = document.createElement("span");
  closeBtn.id = "imageModalClose";
  closeBtn.innerHTML = "&times;";
  const prevBtn = document.createElement("span");
  prevBtn.id = "imageModalPrev";
  prevBtn.innerHTML = "&#10094;";
  const nextBtn = document.createElement("span");
  nextBtn.id = "imageModalNext";
  nextBtn.innerHTML = "&#10095;";
  const modalImg = document.createElement("img");
  modalImg.id = "imageModalContent";
  modal.appendChild(closeBtn);
  modal.appendChild(prevBtn);
  modal.appendChild(nextBtn);
  modal.appendChild(modalImg);
  document.body.appendChild(modal);
  const allImages = Array.from(document.querySelectorAll("img"));
  let currentIndex = -1;
  function openModal(index) {
    currentIndex = index;
    modalImg.src = allImages[currentIndex].src;
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  }
  function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }
  function showPrev() {
    if (allImages.length < 2) return;
    currentIndex = currentIndex > 0 ? currentIndex - 1 : allImages.length - 1;
    modalImg.src = allImages[currentIndex].src;
  }
  function showNext() {
    if (allImages.length < 2) return;
    currentIndex = currentIndex < allImages.length - 1 ? currentIndex + 1 : 0;
    modalImg.src = allImages[currentIndex].src;
  }
  allImages.forEach((img, idx) => {
    img.style.cursor = "pointer";
    img.addEventListener("click", function () {
      openModal(idx);
    });
  });
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", function (e) {
    if (e.target === modal) closeModal();
  });
  prevBtn.addEventListener("click", showPrev);
  nextBtn.addEventListener("click", showNext);
  let startX = 0;
  modal.addEventListener("touchstart", function (e) {
    startX = e.touches[0].clientX;
  });
  modal.addEventListener("touchend", function (e) {
    const endX = e.changedTouches[0].clientX;
    if (Math.abs(endX - startX) > 50) {
      if (endX < startX) showNext();
      else showPrev();
    }
  });

  document.querySelectorAll('.org-ul li, .org-ol li').forEach(item => {
    item.addEventListener('click', function () {
      const checkbox = item.querySelector('input[type="checkbox"]');
      checkbox.checked = !checkbox.checked;
      item.classList.toggle('checked', checkbox.checked);
    });
  });

})

$(document).ready(function () {
  $("table.sortable").tablesorter();
});
