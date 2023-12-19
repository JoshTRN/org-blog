((nil . ((org-publish-project-alist . (("blog-org"
         :base-directory "~/org/blog"
         :base-extension "org"
         :publishing-directory "/ssh:joshua@joshua-wood.dev:/home/joshua/joshua-wood.dev"
         :recursive t
         :publishing-function org-html-publish-to-html
         :headline-levels 4
         :html-head "
            <link rel=\"stylesheet\" type=\"text/css\" href=\"/css/htmlize.css\"/>
            <link rel=\"stylesheet\" type=\"text/css\" href=\"/css/readtheorg.css\"/>
            <script src=\"https://cdnjs.cloudflare.com/ajax/libs/slideout/1.0.1/slideout.min.js\" integrity=\"sha512-GA1YgNe8NTU3XMDMofUTpTNqMsPUL6VjYgc6NjOUTA/6pwTFlTmFc/tk+LnDfXD3/mNGZcik9kvfAjeVPTHisA==\" crossorigin=\"anonymous\" referrerpolicy=\"no-referrer\" defer></script>
            <script type=\"text/javascript\" src=\"/js/jquery.min.js\"></script>
            <script type=\"text/javascript\" src=\"/js/bootstrap.min.js\"></script>
            <script type=\"text/javascript\" src=\"/js/jquery.stickytableheaders.min.js\"></script>
            <script type=\"text/javascript\" src=\"/js/script.js\"></script>
 "
         :html-headline "Your Blog Title"
         )
        ("blog-js"
         :base-directory "~/org/blog"
         :base-extension "js"
         :publishing-directory "/ssh:joshua@joshua-wood.dev:/home/joshua/joshua-wood.dev"
         :recursive t
         :publishing-function org-publish-attachment
         )
        ("blog-css"
         :base-directory "~/org/blog"
         :base-extension "css"
         :publishing-directory "/ssh:joshua@joshua-wood.dev:/home/joshua/joshua-wood.dev"
         :recursive t
         :publishing-function org-publish-attachment
         )
        ("blog-images"
         :base-directory "~/org/blog"
         :base-extension "\\(png\\|jpeg\\|jpg\\|gif\\)"
         :publishing-directory "/ssh:joshua@joshua-wood.dev:/home/joshua/joshua-wood.dev"
         :recursive t
         :publishing-function org-publish-attachment
         )
        ("blog-video"
         :base-directory "~/org/blog"
         :base-extension "mp4"
         :publishing-directory "/ssh:joshua@joshua-wood.dev:/home/joshua/joshua-wood.dev"
         :recursive t
         :publishing-function org-publish-attachment
         )
        ("blog" :components ("blog-org" "blog-js" "blog-css" "blog-images" "blog-video"))
        ))))))
