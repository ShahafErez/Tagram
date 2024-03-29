import html


class Defect:
    def __init__(self, story_id, kind, subkind, message, story_title):
        self.story_id = story_id
        self.kind = kind
        self.subkind = subkind
        self.message = message
        self.story_title = story_title

    def print_txt(self):
        values = {"story id": self.story_id,
                  "Defect kind": self.kind,
                  "Defect subkind": self.subkind,
                  "Message": self.message
                  }
        return values

    def print_html(self, doc, tag, text):
        with tag('tr'):
            with tag('td'):
                text(self.story_id)
            with tag('td'):
                text(self.story_title)
            with tag('td'):
                text(self.kind)
            with tag('td'):
                text(self.subkind)
            with tag('td'):
                doc.asis(self.message.replace(
                    "[*", "<mark>").replace("*]", "</mark>"))
