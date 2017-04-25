import os
import jinja2
import webapp2

############################################
# Set-up and housekeeping
############################################

template_dir = os.path.join(os.path.dirname(__file__), 'templates')
jinja_env = jinja2.Environment(loader=jinja2.FileSystemLoader(template_dir),
                               autoescape=True)


# def render_str(self, template, **params):
#     t = jinja_env.get_template(template)
#     return t.render(params)


class Handler(webapp2.RequestHandler):
    def write(self, *a, **kw):
        self.response.out.write(*a, **kw)

    def render_str(self, template, **params):
        t = jinja_env.get_template(template)
        return t.render(params)

    def render(self, template, **kw):
        self.write(self.render_str(template, **kw))


############################################
# End set-up and housekeeping
############################################

############################################
# Display initial blog page
############################################

class MainPage(Handler):
    def render_front(self):
        self.render('cats.html')

    def get(self):
        self.render_front()
        # self.response.write("hello world")


class CatPage(Handler):
    def render_front(self):
        self.render('cats.html')

    def get(self):
        self.render_front()
        # self.response.write("hello world")

############################################
# End display initial blog page
############################################

############################################
# Information for handling and redirects
############################################


app = webapp2.WSGIApplication([('/', MainPage),
                              ('/cats/', CatPage),
                               ],
                              debug=True)
