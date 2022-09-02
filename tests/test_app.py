from unittest import TestCase
from app import app


class FlaskTests(TestCase):

    # write tests for every view function / feature!

    def setUp(self):
        app.config['TESTING'] = True

    def test_board_page(self):
        """ Is home page successfully responging with html? """
        with app.test_client() as client:
            res = client.get("/")
            html = res.get_data(as_text=True)

            self.assertEqual(res.status_code, 200)
            self.assertIn('<h1 class="title">Boggle!</h1>', html)

    def test_guess(self):
        """ Is the user's guess being validated correctly? """
        with app.test_client() as client:
            with client.session_transaction() as sess:
                sess["board"] = [["B", "E", "K", "G", "L"],
                                 ["E", "F", "R", "T", "S"],
                                 ["K", "A", "Z", "B", "V"],
                                 ["Q", "I", "N", "P", "D"],
                                 ["C", "A", "B", "S", "M"]]

            res = client.get('/guess?guess=bean')

            self.assertEqual(res.status_code, 200)
            self.assertEqual(res.json['result'], 'ok')

    def test_invalid(self):
        """ Are invalid guesses returning the correct json response? """
        with app.test_client() as client:
            client.get('/')
            res = client.get('/guess?guess=tomato')

            self.assertEqual(res.status_code, 200)
            self.assertEqual(res.json['result'], 'not-on-board')
