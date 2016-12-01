/**
 * The $1 Unistroke Recognizer (JavaScript version)
 *
 *  Jacob O. Wobbrock, Ph.D.
 *   The Information School
 *  University of Washington
 *  Seattle, WA 98195-2840
 *  wobbrock@uw.edu
 *
 *  Andrew D. Wilson, Ph.D.
 *  Microsoft Research
 *  One Microsoft Way
 *  Redmond, WA 98052
 *  awilson@microsoft.com
 *
 *  Yang Li, Ph.D.
 *  Department of Computer Science and Engineering
 *   University of Washington
 *  Seattle, WA 98195-2840
 *   yangli@cs.washington.edu
 *
 * The academic publication for the $1 recognizer, and what should be 
 * used to cite it, is:
 *
 *  Wobbrock, J.O., Wilson, A.D. and Li, Y. (2007). Gestures without 
 *    libraries, toolkits or training: A $1 recognizer for user interface 
 *    prototypes. Proceedings of the ACM Symposium on User Interface 
 *    Software and Technology (UIST '07). Newport, Rhode Island (October 
 *    7-10, 2007). New York: ACM Press, pp. 159-168.
 *
 * The Protractor enhancement was separately published by Yang Li and programmed 
 * here by Jacob O. Wobbrock:
 *
 *  Li, Y. (2010). Protractor: A fast and accurate gesture
 *    recognizer. Proceedings of the ACM Conference on Human
 *    Factors in Computing Systems (CHI '10). Atlanta, Georgia
 *    (April 10-15, 2010). New York: ACM Press, pp. 2169-2172.
 *
 * This software is distributed under the "New BSD License" agreement:
 *
 * Copyright (C) 2007-2012, Jacob O. Wobbrock, Andrew D. Wilson and Yang Li.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *    * Redistributions of source code must retain the above copyright
 *      notice, this list of conditions and the following disclaimer.
 *    * Redistributions in binary form must reproduce the above copyright
 *      notice, this list of conditions and the following disclaimer in the
 *      documentation and/or other materials provided with the distribution.
 *    * Neither the names of the University of Washington nor Microsoft,
 *      nor the names of its contributors may be used to endorse or promote
 *      products derived from this software without specific prior written
 *      permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL Jacob O. Wobbrock OR Andrew D. Wilson
 * OR Yang Li BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
 * OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
**/
//
// Point class
//
function Point(x, y) // constructor
{
  this.X = x;
  this.Y = y;
  this.toString = function() {
    return "new Point(" + this.X + "," + this.Y + ")";
  };
}
//
// Rectangle class
//
function Rectangle(x, y, width, height) // constructor
{
  this.X = x;
  this.Y = y;
  this.Width = width;
  this.Height = height;
}
//
// Unistroke class: a unistroke template
//
function Unistroke(name, points) // constructor
{
  this.Name = name;
  this.Points = Resample(points, NumPoints);
  var radians = IndicativeAngle(this.Points);
  this.Points = RotateBy(this.Points, -radians);
  this.Points = ScaleTo(this.Points, SquareSize);
  this.Points = TranslateTo(this.Points, Origin);
  this.Vector = Vectorize(this.Points); // for Protractor
  this.toString = function() {
    return "Unistroke(\"" + this.Name + "\", " + this.Points.toString() + ")";
  }
}
//
// Result class
//
function Result(name, score) // constructor
{
  this.Name = name;
  this.Score = score;
}
//
// DollarRecognizer class constants
//
var NumUnistrokes = 12;
var NumPoints = 64;
var SquareSize = 250;
var Origin = new Point(0,0);
var Diagonal = Math.sqrt(SquareSize * SquareSize + SquareSize * SquareSize);
var HalfDiagonal = 0 * Diagonal;
var AngleRange = Deg2Rad(45);
var AnglePrecision = Deg2Rad(2);
var Phi = 0 * (-1 + Math.sqrt(5)); // Golden Ratio
//
// DollarRecognizer class
//
function DollarRecognizer() // constructor
{
  //
  // one built-in unistroke per gesture type
  //
  this.Unistrokes = new Array(NumUnistrokes);
  this.Unistrokes[0] = new Unistroke("play", new Array(new Point(291,202),new Point(292,203),new Point(299,207),new Point(299,207),new Point(304,210),new Point(308,213),new Point(308,213),new Point(312,215),new Point(317,218),new Point(317,218),new Point(324,223),new Point(326,224),new Point(326,224),new Point(335,229),new Point(335,229),new Point(339,232),new Point(344,235),new Point(344,235),new Point(353,241),new Point(353,241),new Point(354,242),new Point(362,247),new Point(362,247),new Point(370,252),new Point(370,252),new Point(370,252),new Point(379,258),new Point(379,258),new Point(388,264),new Point(388,264),new Point(390,266),new Point(396,271),new Point(396,271),new Point(403,276),new Point(404,277),new Point(404,277),new Point(413,283),new Point(413,283),new Point(417,286),new Point(422,289),new Point(422,289),new Point(430,295),new Point(430,295),new Point(432,296),new Point(439,301),new Point(439,301),new Point(447,308),new Point(447,308),new Point(452,312),new Point(455,314),new Point(455,314),new Point(463,321),new Point(463,321),new Point(465,322),new Point(471,328),new Point(471,328),new Point(473,329),new Point(480,334),new Point(480,334),new Point(486,339),new Point(488,340),new Point(488,340),new Point(497,346),new Point(497,346),new Point(500,349),new Point(505,353),new Point(505,353),new Point(507,355),new Point(513,359),new Point(513,359),new Point(517,362),new Point(521,365),new Point(522,365),new Point(522,365),new Point(527,369),new Point(530,371),new Point(530,371),new Point(531,372),new Point(534,375),new Point(538,378),new Point(538,378),new Point(538,378),new Point(539,379),new Point(540,380),new Point(541,380),new Point(541,381),new Point(542,382),new Point(542,382),new Point(542,382),new Point(542,382),new Point(542,383),new Point(542,383),new Point(542,384),new Point(542,385),new Point(540,386),new Point(539,386),new Point(539,386),new Point(537,388),new Point(534,390),new Point(530,391),new Point(530,391),new Point(527,393),new Point(521,396),new Point(521,396),new Point(514,403),new Point(513,403),new Point(513,403),new Point(504,408),new Point(504,408),new Point(504,409),new Point(495,414),new Point(495,414),new Point(494,416),new Point(486,420),new Point(486,420),new Point(477,425),new Point(477,425),new Point(476,427),new Point(469,432),new Point(469,432),new Point(462,439),new Point(461,439),new Point(461,439),new Point(453,445),new Point(453,445),new Point(446,452),new Point(445,452),new Point(445,452),new Point(437,458),new Point(437,458),new Point(428,465),new Point(428,465),new Point(420,471),new Point(420,471),new Point(412,477),new Point(412,477),new Point(412,478),new Point(404,485),new Point(404,485),new Point(401,489),new Point(396,492),new Point(396,492),new Point(389,499),new Point(389,499),new Point(381,506),new Point(381,506),new Point(380,508),new Point(373,513),new Point(373,513),new Point(372,514),new Point(365,520),new Point(365,520),new Point(358,527),new Point(358,527),new Point(350,535),new Point(350,535),new Point(345,541),new Point(342,542),new Point(342,542),new Point(335,548),new Point(334,548),new Point(334,548),new Point(326,555),new Point(326,555),new Point(322,560),new Point(319,562),new Point(319,562),new Point(311,570),new Point(311,570),new Point(311,571),new Point(303,577),new Point(303,577),new Point(300,580),new Point(296,583),new Point(295,583),new Point(295,583),new Point(290,587),new Point(286,589),new Point(286,589),new Point(284,591),new Point(281,595),new Point(279,596),new Point(279,596),new Point(278,598),new Point(276,600),new Point(274,601),new Point(273,602),new Point(273,602),new Point(272,603),new Point(272,603),new Point(272,603),new Point(272,603),new Point(271,603))); 
  this.Unistrokes[1] = new Unistroke("add", Array(new Point(433,492),new Point(434,492),new Point(438,492),new Point(440,491),new Point(440,491),new Point(447,490),new Point(447,490),new Point(450,490),new Point(454,489),new Point(454,489),new Point(458,489),new Point(461,488),new Point(461,488),new Point(468,488),new Point(468,488),new Point(469,488),new Point(475,486),new Point(475,486),new Point(478,486),new Point(482,486),new Point(482,486),new Point(489,486),new Point(490,486),new Point(490,486),new Point(496,486),new Point(497,485),new Point(497,485),new Point(504,485),new Point(504,485),new Point(505,485),new Point(511,485),new Point(511,485),new Point(516,485),new Point(519,485),new Point(519,485),new Point(523,485),new Point(526,485),new Point(526,485),new Point(529,485),new Point(533,485),new Point(533,485),new Point(536,485),new Point(540,485),new Point(540,485),new Point(541,486),new Point(547,486),new Point(547,486),new Point(547,486),new Point(552,487),new Point(554,487),new Point(554,487),new Point(561,487),new Point(562,487),new Point(562,487),new Point(563,487),new Point(568,486),new Point(569,486),new Point(569,486),new Point(571,486),new Point(574,485),new Point(576,485),new Point(576,485),new Point(577,485),new Point(579,483),new Point(580,483),new Point(581,482),new Point(582,482),new Point(582,481),new Point(582,481),new Point(582,481),new Point(583,481),new Point(583,481),new Point(583,481),new Point(582,479),new Point(581,478),new Point(580,476),new Point(580,476),new Point(580,476),new Point(577,471),new Point(576,470),new Point(576,470),new Point(572,464),new Point(572,464),new Point(572,464),new Point(568,458),new Point(568,458),new Point(567,456),new Point(564,452),new Point(564,452),new Point(561,445),new Point(561,445),new Point(560,444),new Point(557,439),new Point(557,439),new Point(555,436),new Point(552,433),new Point(552,433),new Point(548,429),new Point(547,428),new Point(547,428),new Point(544,422),new Point(544,422),new Point(543,421),new Point(539,416),new Point(539,416),new Point(539,416),new Point(535,410),new Point(535,410),new Point(532,404),new Point(532,404),new Point(531,403),new Point(528,400),new Point(527,399),new Point(527,399),new Point(525,396),new Point(523,393),new Point(523,393),new Point(522,392),new Point(520,389),new Point(519,388),new Point(518,387),new Point(518,387),new Point(518,387),new Point(518,387),new Point(517,386),new Point(515,386),new Point(515,386),new Point(514,385),new Point(514,385),new Point(513,385),new Point(513,385),new Point(512,385),new Point(512,385),new Point(512,385),new Point(511,386),new Point(511,387),new Point(510,390),new Point(510,390),new Point(510,390),new Point(510,393),new Point(509,398),new Point(509,398),new Point(509,400),new Point(508,405),new Point(508,405),new Point(508,407),new Point(508,412),new Point(508,412),new Point(508,415),new Point(508,419),new Point(508,419),new Point(508,424),new Point(507,426),new Point(507,426),new Point(506,433),new Point(506,433),new Point(506,438),new Point(506,441),new Point(506,441),new Point(506,448),new Point(506,448),new Point(506,449),new Point(506,455),new Point(506,455),new Point(506,462),new Point(506,462),new Point(506,463),new Point(506,469),new Point(506,469),new Point(506,474),new Point(506,477),new Point(506,477),new Point(506,484),new Point(506,484),new Point(506,485),new Point(506,491),new Point(506,491),new Point(506,497),new Point(506,498),new Point(506,498),new Point(506,503),new Point(506,506),new Point(506,506),new Point(506,513),new Point(506,513),new Point(506,514),new Point(506,520),new Point(506,520),new Point(506,521),new Point(506,527),new Point(506,527),new Point(506,532),new Point(506,534),new Point(506,534),new Point(507,537),new Point(507,541),new Point(507,541),new Point(507,542),new Point(508,546),new Point(508,549),new Point(508,549),new Point(509,551),new Point(509,554),new Point(509,556),new Point(509,556),new Point(510,557),new Point(511,559),new Point(511,561),new Point(511,561),new Point(511,561),new Point(511,562),new Point(511,562),new Point(511,562),new Point(512,562)));
  this.Unistrokes[2] = new Unistroke("remove", new Array(new Point(531,453),new Point(530,453),new Point(525,455),new Point(523,455),new Point(523,455),new Point(521,456),new Point(516,457),new Point(516,457),new Point(514,458),new Point(509,458),new Point(509,458),new Point(507,459),new Point(502,460),new Point(501,460),new Point(501,460),new Point(494,460),new Point(494,460),new Point(494,461),new Point(486,461),new Point(486,461),new Point(485,462),new Point(479,462),new Point(479,462),new Point(471,462),new Point(471,462),new Point(471,462),new Point(464,462),new Point(464,462),new Point(457,464),new Point(456,464),new Point(456,464),new Point(449,464),new Point(449,464),new Point(446,464),new Point(441,464),new Point(441,464),new Point(441,464),new Point(434,464),new Point(434,464),new Point(430,465),new Point(426,465),new Point(426,465),new Point(421,467),new Point(419,467),new Point(419,467),new Point(415,467),new Point(412,467),new Point(412,467),new Point(410,468),new Point(405,469),new Point(404,469),new Point(404,469),new Point(402,469),new Point(400,470),new Point(398,471),new Point(397,471),new Point(397,471),new Point(397,471),new Point(395,471),new Point(394,472),new Point(393,472),new Point(392,472),new Point(392,472),new Point(391,472),new Point(390,472),new Point(390,472),new Point(390,473),new Point(389,474),new Point(388,474),new Point(386,475),new Point(386,475),new Point(384,475),new Point(384,475),new Point(384,475),new Point(384,475),new Point(383,475),new Point(382,475),new Point(382,476),new Point(381,476),new Point(381,476),new Point(381,475),new Point(381,475),new Point(381,473),new Point(381,472),new Point(381,472),new Point(383,470),new Point(385,466),new Point(385,466),new Point(389,460),new Point(389,460),new Point(390,460),new Point(394,454),new Point(394,454),new Point(395,453),new Point(398,447),new Point(398,447),new Point(402,443),new Point(402,441),new Point(402,441),new Point(407,435),new Point(407,435),new Point(409,433),new Point(411,429),new Point(411,429),new Point(415,423),new Point(415,423),new Point(419,419),new Point(420,417),new Point(420,417),new Point(424,411),new Point(424,411),new Point(426,410),new Point(429,405),new Point(429,405),new Point(431,402),new Point(433,398),new Point(433,398),new Point(434,397),new Point(437,392),new Point(437,392),new Point(439,390),new Point(441,386),new Point(441,386),new Point(443,384),new Point(445,381),new Point(445,379),new Point(445,379),new Point(446,379),new Point(447,377),new Point(448,376),new Point(448,376),new Point(449,375),new Point(449,375),new Point(450,374),new Point(450,374),new Point(450,373),new Point(450,373),new Point(451,373),new Point(452,373),new Point(453,373),new Point(454,373),new Point(454,373),new Point(455,372),new Point(455,372),new Point(455,372),new Point(456,372),new Point(456,372),new Point(456,372),new Point(456,374),new Point(456,377),new Point(456,380),new Point(456,380),new Point(456,382),new Point(456,387),new Point(456,387),new Point(456,391),new Point(456,395),new Point(456,395),new Point(456,398),new Point(456,402),new Point(456,402),new Point(456,406),new Point(456,410),new Point(456,410),new Point(457,417),new Point(457,417),new Point(457,417),new Point(457,425),new Point(457,425),new Point(457,431),new Point(457,433),new Point(457,433),new Point(457,440),new Point(457,440),new Point(457,445),new Point(457,448),new Point(457,448),new Point(457,455),new Point(457,455),new Point(457,459),new Point(457,463),new Point(457,463),new Point(457,470),new Point(457,470),new Point(457,473),new Point(457,478),new Point(457,478),new Point(457,485),new Point(457,485),new Point(457,490),new Point(457,493),new Point(457,493),new Point(457,500),new Point(457,500),new Point(457,504),new Point(457,508),new Point(457,508),new Point(457,515),new Point(457,515),new Point(457,515),new Point(457,523),new Point(457,523),new Point(457,524),new Point(457,530),new Point(457,530),new Point(457,535),new Point(457,538),new Point(457,538),new Point(457,542),new Point(457,545),new Point(457,545),new Point(457,548),new Point(457,553),new Point(457,553),new Point(457,553),new Point(457,555),new Point(457,557),new Point(457,559),new Point(457,560),new Point(457,560),new Point(457,560),new Point(457,560),new Point(457,561),new Point(457,561)));
  this.Unistrokes[3] = new Unistroke("forward", new Array(new Point(348,327),new Point(348,327),new Point(358,329),new Point(358,329),new Point(362,330),new Point(369,332),new Point(369,332),new Point(373,334),new Point(379,337),new Point(379,337),new Point(387,341),new Point(389,341),new Point(389,341),new Point(399,344),new Point(399,344),new Point(401,345),new Point(410,347),new Point(410,347),new Point(420,351),new Point(420,351),new Point(423,352),new Point(431,354),new Point(431,354),new Point(434,356),new Point(439,358),new Point(441,359),new Point(441,359),new Point(446,362),new Point(451,363),new Point(451,363),new Point(452,364),new Point(456,365),new Point(458,367),new Point(460,368),new Point(460,368),new Point(460,368),new Point(462,369),new Point(462,370),new Point(464,372),new Point(464,373),new Point(464,374),new Point(464,376),new Point(464,377),new Point(464,377),new Point(464,378),new Point(464,380),new Point(464,382),new Point(462,384),new Point(459,386),new Point(459,386),new Point(458,388),new Point(450,393),new Point(449,393),new Point(449,393),new Point(444,397),new Point(440,399),new Point(440,399),new Point(436,402),new Point(431,404),new Point(431,404),new Point(426,407),new Point(421,409),new Point(421,409),new Point(418,411),new Point(411,414),new Point(411,414),new Point(408,416),new Point(401,419),new Point(401,419),new Point(395,424),new Point(392,425),new Point(392,425),new Point(392,426),new Point(387,428),new Point(383,430),new Point(383,430),new Point(383,431),new Point(379,432),new Point(377,434),new Point(376,434),new Point(375,435),new Point(375,435),new Point(375,435),new Point(376,434),new Point(376,434),new Point(378,433),new Point(382,432),new Point(386,430),new Point(386,430),new Point(389,430),new Point(397,428),new Point(397,428),new Point(403,427),new Point(407,425),new Point(407,425),new Point(418,423),new Point(418,423),new Point(420,423),new Point(429,420),new Point(429,420),new Point(437,418),new Point(439,417),new Point(439,417),new Point(450,415),new Point(450,415),new Point(461,412),new Point(461,412),new Point(465,412),new Point(471,409),new Point(471,409),new Point(481,405),new Point(481,405),new Point(482,405),new Point(492,402),new Point(492,402),new Point(495,402),new Point(502,398),new Point(502,398),new Point(512,395),new Point(513,394),new Point(513,394),new Point(522,389),new Point(522,389),new Point(531,386),new Point(532,385),new Point(532,385),new Point(543,380),new Point(543,380),new Point(545,380),new Point(552,375),new Point(552,375),new Point(554,374),new Point(562,369),new Point(562,369),new Point(564,369),new Point(571,364),new Point(571,364),new Point(572,364),new Point(577,361),new Point(580,358),new Point(580,358),new Point(586,355),new Point(588,353),new Point(589,351),new Point(589,351),new Point(591,350),new Point(594,348),new Point(596,347),new Point(597,346),new Point(597,344),new Point(597,344),new Point(598,344),new Point(598,343),new Point(599,342),new Point(599,342),new Point(599,342),new Point(599,341),new Point(599,340),new Point(593,337),new Point(593,337),new Point(592,337),new Point(584,334),new Point(583,333),new Point(583,333),new Point(572,330),new Point(572,330),new Point(570,330),new Point(562,327),new Point(562,327),new Point(551,324),new Point(551,324),new Point(549,324),new Point(541,323),new Point(540,322),new Point(540,322),new Point(529,321),new Point(529,321),new Point(524,320),new Point(519,319),new Point(519,319),new Point(508,317),new Point(508,317),new Point(497,315),new Point(497,315),new Point(487,314),new Point(486,313),new Point(486,313),new Point(475,311),new Point(475,311),new Point(466,310),new Point(464,310),new Point(464,310),new Point(453,310),new Point(453,310),new Point(452,310),new Point(442,309),new Point(442,309),new Point(439,309),new Point(431,309),new Point(431,309),new Point(430,309),new Point(421,309),new Point(420,309),new Point(420,309),new Point(414,309),new Point(409,309),new Point(409,309),new Point(408,309),new Point(404,309),new Point(402,309),new Point(400,309),new Point(400,309),new Point(399,309),new Point(399,309),new Point(399,309),new Point(399,309)));
  this.Unistrokes[4] = new Unistroke("back", new Array(new Point(654,249),new Point(653,249),new Point(653,250),new Point(651,250),new Point(646,252),new Point(640,256),new Point(638,256),new Point(638,256),new Point(626,262),new Point(622,263),new Point(622,263),new Point(611,270),new Point(607,271),new Point(607,271),new Point(592,279),new Point(591,279),new Point(591,279),new Point(575,288),new Point(575,288),new Point(570,291),new Point(559,295),new Point(559,295),new Point(548,301),new Point(543,302),new Point(543,302),new Point(531,308),new Point(526,309),new Point(526,309),new Point(511,315),new Point(510,315),new Point(510,315),new Point(493,321),new Point(493,321),new Point(491,323),new Point(477,328),new Point(477,328),new Point(474,330),new Point(471,331),new Point(460,334),new Point(460,334),new Point(460,335),new Point(453,339),new Point(448,340),new Point(446,341),new Point(445,342),new Point(444,342),new Point(444,342),new Point(444,343),new Point(444,343),new Point(444,343),new Point(444,343),new Point(444,344),new Point(445,344),new Point(451,345),new Point(458,349),new Point(458,349),new Point(462,351),new Point(474,356),new Point(474,356),new Point(476,357),new Point(491,363),new Point(491,363),new Point(493,364),new Point(507,368),new Point(507,368),new Point(517,372),new Point(524,375),new Point(524,375),new Point(531,378),new Point(541,380),new Point(541,380),new Point(555,384),new Point(558,384),new Point(558,384),new Point(576,387),new Point(576,387),new Point(579,388),new Point(593,391),new Point(593,391),new Point(593,391),new Point(607,394),new Point(610,395),new Point(610,395),new Point(615,397),new Point(627,398),new Point(628,398),new Point(628,398),new Point(631,399),new Point(637,400),new Point(639,400),new Point(640,400),new Point(640,401),new Point(638,401),new Point(635,401),new Point(635,401),new Point(634,401),new Point(625,401),new Point(617,401),new Point(617,401),new Point(614,401),new Point(605,401),new Point(599,400),new Point(599,400),new Point(582,399),new Point(582,399),new Point(577,399),new Point(564,397),new Point(564,397),new Point(557,397),new Point(546,396),new Point(546,396),new Point(529,395),new Point(529,395),new Point(525,395),new Point(511,392),new Point(511,392),new Point(494,390),new Point(494,390),new Point(493,390),new Point(476,389),new Point(476,389),new Point(458,388),new Point(458,388),new Point(456,388),new Point(440,386),new Point(440,386),new Point(424,385),new Point(423,384),new Point(423,384),new Point(405,383),new Point(405,383),new Point(392,383),new Point(387,382),new Point(387,382),new Point(375,381),new Point(370,380),new Point(370,380),new Point(352,379),new Point(352,379),new Point(347,379),new Point(334,378),new Point(334,378),new Point(333,378),new Point(325,378),new Point(317,376),new Point(317,376),new Point(313,375),new Point(305,375),new Point(301,374),new Point(300,373),new Point(300,373),new Point(298,372),new Point(297,372),new Point(296,371),new Point(296,370),new Point(296,369),new Point(296,368),new Point(296,366),new Point(296,364),new Point(299,361),new Point(300,359),new Point(300,359),new Point(303,356),new Point(309,351),new Point(313,347),new Point(313,347),new Point(314,347),new Point(327,337),new Point(327,337),new Point(328,337),new Point(334,330),new Point(340,326),new Point(340,326),new Point(346,323),new Point(355,316),new Point(355,316),new Point(359,315),new Point(371,307),new Point(371,307),new Point(380,303),new Point(386,299),new Point(386,299),new Point(392,297),new Point(403,292),new Point(403,292),new Point(409,291),new Point(419,285),new Point(419,285),new Point(430,281),new Point(435,278),new Point(435,278),new Point(444,276),new Point(452,272),new Point(452,272),new Point(461,269),new Point(469,266),new Point(469,266),new Point(478,264),new Point(485,261),new Point(485,260),new Point(485,260),new Point(499,256),new Point(502,254),new Point(502,254),new Point(504,254),new Point(510,251),new Point(517,249),new Point(518,247),new Point(518,247),new Point(520,247),new Point(529,243),new Point(532,242),new Point(534,240),new Point(534,240),new Point(537,239),new Point(541,236),new Point(550,232),new Point(550,232),new Point(552,232),new Point(557,229),new Point(563,226),new Point(566,224),new Point(566,223),new Point(566,223),new Point(571,222),new Point(574,220),new Point(578,220),new Point(580,218),new Point(581,218),new Point(582,218),new Point(582,218)));
  this.Unistrokes[5] = new Unistroke("louder", new Array(new Point(211,329),new Point(211,329),new Point(216,329),new Point(223,330),new Point(225,330),new Point(225,330),new Point(231,330),new Point(240,330),new Point(240,330),new Point(243,331),new Point(254,331),new Point(254,331),new Point(254,331),new Point(268,331),new Point(269,331),new Point(269,331),new Point(279,331),new Point(283,331),new Point(283,331),new Point(298,331),new Point(298,331),new Point(299,331),new Point(313,331),new Point(313,331),new Point(313,331),new Point(327,332),new Point(327,332),new Point(330,333),new Point(342,333),new Point(342,333),new Point(347,333),new Point(356,333),new Point(356,333),new Point(364,334),new Point(371,335),new Point(371,335),new Point(378,336),new Point(385,336),new Point(385,336),new Point(395,338),new Point(400,338),new Point(400,338),new Point(408,339),new Point(414,340),new Point(414,340),new Point(420,342),new Point(426,343),new Point(429,343),new Point(429,343),new Point(433,344),new Point(442,344),new Point(443,344),new Point(443,344),new Point(445,345),new Point(448,346),new Point(449,346),new Point(450,346),new Point(450,346),new Point(450,346),new Point(450,347),new Point(450,346),new Point(450,346),new Point(450,345),new Point(450,342),new Point(450,340),new Point(450,340),new Point(450,337),new Point(450,330),new Point(450,325),new Point(450,325),new Point(451,324),new Point(453,312),new Point(453,311),new Point(453,311),new Point(454,301),new Point(454,296),new Point(454,296),new Point(456,287),new Point(456,282),new Point(456,282),new Point(457,273),new Point(458,267),new Point(458,267),new Point(460,260),new Point(461,253),new Point(461,253),new Point(463,246),new Point(464,239),new Point(464,239),new Point(466,235),new Point(469,225),new Point(469,225),new Point(470,223),new Point(472,219),new Point(475,212),new Point(475,212),new Point(476,212),new Point(478,207),new Point(480,203),new Point(482,200),new Point(482,199),new Point(482,199),new Point(483,199),new Point(484,198),new Point(485,197),new Point(486,196),new Point(486,196),new Point(487,196),new Point(488,196),new Point(489,196),new Point(490,196),new Point(491,196),new Point(493,198),new Point(494,199),new Point(494,199),new Point(496,202),new Point(498,207),new Point(499,212),new Point(499,212),new Point(500,214),new Point(502,220),new Point(502,227),new Point(502,227),new Point(503,231),new Point(504,241),new Point(504,241),new Point(505,252),new Point(505,256),new Point(505,256),new Point(505,270),new Point(505,270),new Point(505,272),new Point(505,285),new Point(505,285),new Point(505,292),new Point(505,299),new Point(505,299),new Point(505,309),new Point(505,314),new Point(505,314),new Point(505,329),new Point(505,329),new Point(505,343),new Point(505,343),new Point(505,346),new Point(503,358),new Point(503,358),new Point(503,363),new Point(501,372),new Point(501,372),new Point(499,386),new Point(498,387),new Point(498,387),new Point(494,401),new Point(494,401),new Point(491,415),new Point(491,415),new Point(490,419),new Point(487,429),new Point(487,429),new Point(487,432),new Point(483,443),new Point(483,443),new Point(479,457),new Point(479,457),new Point(479,460),new Point(474,471),new Point(474,471),new Point(474,474),new Point(470,485),new Point(470,485),new Point(469,488),new Point(467,495),new Point(465,499),new Point(465,499),new Point(463,506),new Point(461,512),new Point(460,512),new Point(460,512),new Point(458,519),new Point(457,522),new Point(456,523),new Point(456,524),new Point(456,525),new Point(456,525),new Point(456,526),new Point(456,525),new Point(456,525),new Point(456,525),new Point(455,524),new Point(455,519),new Point(454,511),new Point(454,511),new Point(454,511),new Point(454,502),new Point(454,496),new Point(454,496),new Point(454,488),new Point(453,482),new Point(453,482),new Point(452,471),new Point(452,467),new Point(452,467),new Point(452,457),new Point(452,453),new Point(452,453),new Point(452,438),new Point(452,438),new Point(452,437),new Point(452,424),new Point(452,424),new Point(452,423),new Point(452,409),new Point(452,409),new Point(452,406),new Point(452,401),new Point(452,394),new Point(452,394),new Point(452,387),new Point(452,381),new Point(452,380),new Point(452,380),new Point(452,374),new Point(452,367),new Point(452,365),new Point(452,365),new Point(452,363),new Point(452,359),new Point(452,354),new Point(452,353),new Point(452,353),new Point(452,352),new Point(452,352),new Point(452,352),new Point(452,351),new Point(452,351),new Point(452,351),new Point(452,351),new Point(452,351)));
  this.Unistrokes[6] = new Unistroke("quieter", new Array(new Point(785,531),new Point(785,531),new Point(782,531),new Point(778,531),new Point(772,530),new Point(770,529),new Point(770,529),new Point(765,528),new Point(755,527),new Point(755,527),new Point(745,527),new Point(740,526),new Point(740,526),new Point(725,525),new Point(725,525),new Point(721,525),new Point(711,525),new Point(711,525),new Point(696,525),new Point(696,525),new Point(693,525),new Point(681,525),new Point(681,525),new Point(679,525),new Point(666,523),new Point(666,523),new Point(655,523),new Point(651,523),new Point(651,523),new Point(636,523),new Point(636,523),new Point(628,523),new Point(621,523),new Point(621,523),new Point(607,523),new Point(606,523),new Point(606,523),new Point(591,523),new Point(591,523),new Point(587,523),new Point(577,523),new Point(577,523),new Point(567,523),new Point(562,523),new Point(562,523),new Point(553,523),new Point(548,523),new Point(547,523),new Point(547,523),new Point(537,524),new Point(532,524),new Point(532,524),new Point(532,524),new Point(529,524),new Point(528,524),new Point(526,524),new Point(526,524),new Point(525,524),new Point(525,524),new Point(525,523),new Point(525,522),new Point(525,520),new Point(525,517),new Point(525,516),new Point(525,516),new Point(526,510),new Point(526,504),new Point(526,501),new Point(526,501),new Point(526,492),new Point(526,486),new Point(526,486),new Point(526,472),new Point(526,471),new Point(526,471),new Point(526,458),new Point(525,457),new Point(525,457),new Point(524,442),new Point(524,442),new Point(524,438),new Point(522,427),new Point(522,427),new Point(520,414),new Point(519,412),new Point(519,412),new Point(517,400),new Point(516,398),new Point(516,398),new Point(514,383),new Point(514,383),new Point(514,383),new Point(512,377),new Point(509,369),new Point(509,369),new Point(509,366),new Point(507,359),new Point(505,355),new Point(505,355),new Point(505,354),new Point(503,352),new Point(503,351),new Point(502,350),new Point(502,350),new Point(502,350),new Point(501,350),new Point(501,350),new Point(499,354),new Point(498,356),new Point(498,356),new Point(498,357),new Point(495,364),new Point(493,370),new Point(493,370),new Point(493,372),new Point(488,384),new Point(488,384),new Point(488,386),new Point(484,399),new Point(484,399),new Point(483,403),new Point(480,413),new Point(480,413),new Point(479,423),new Point(477,428),new Point(477,428),new Point(474,440),new Point(473,442),new Point(473,442),new Point(470,457),new Point(470,457),new Point(470,460),new Point(468,471),new Point(468,471),new Point(467,481),new Point(466,486),new Point(466,486),new Point(465,501),new Point(465,501),new Point(465,505),new Point(465,516),new Point(465,516),new Point(465,531),new Point(465,531),new Point(465,537),new Point(464,546),new Point(464,546),new Point(463,560),new Point(463,560),new Point(463,561),new Point(463,575),new Point(463,575),new Point(463,584),new Point(463,590),new Point(463,590),new Point(463,605),new Point(463,605),new Point(463,605),new Point(463,620),new Point(463,620),new Point(463,629),new Point(463,635),new Point(463,635),new Point(464,646),new Point(465,650),new Point(465,650),new Point(467,657),new Point(469,661),new Point(470,664),new Point(470,664),new Point(473,673),new Point(475,677),new Point(475,677),new Point(475,677),new Point(477,681),new Point(478,683),new Point(479,684),new Point(481,684),new Point(483,684),new Point(484,684),new Point(485,684),new Point(485,682),new Point(485,682),new Point(488,679),new Point(490,674),new Point(491,668),new Point(491,668),new Point(493,665),new Point(496,657),new Point(496,654),new Point(496,654),new Point(498,648),new Point(501,640),new Point(501,640),new Point(503,637),new Point(504,626),new Point(504,626),new Point(505,626),new Point(510,614),new Point(510,612),new Point(510,612),new Point(514,600),new Point(514,598),new Point(514,598),new Point(517,589),new Point(518,583),new Point(518,583),new Point(520,578),new Point(521,572),new Point(521,569),new Point(521,569),new Point(522,563),new Point(523,556),new Point(523,554),new Point(523,554),new Point(524,550),new Point(524,546),new Point(525,544),new Point(525,542),new Point(525,541),new Point(525,541),new Point(525,540),new Point(525,540),new Point(525,540),new Point(525,540),new Point(525,540),new Point(525,540)));
  this.Unistrokes[7] = new Unistroke("faster", new Array(new Point(463,236),new Point(463,236),new Point(461,239),new Point(458,243),new Point(456,244),new Point(456,244),new Point(453,250),new Point(450,253),new Point(450,253),new Point(447,260),new Point(444,262),new Point(444,262),new Point(437,270),new Point(437,270),new Point(435,274),new Point(431,279),new Point(431,279),new Point(427,286),new Point(425,288),new Point(425,288),new Point(418,296),new Point(418,296),new Point(412,304),new Point(412,304),new Point(411,306),new Point(405,313),new Point(405,313),new Point(401,321),new Point(399,322),new Point(399,322),new Point(393,330),new Point(393,330),new Point(388,338),new Point(386,339),new Point(386,339),new Point(381,348),new Point(381,348),new Point(380,350),new Point(375,357),new Point(375,357),new Point(373,362),new Point(369,366),new Point(369,366),new Point(363,375),new Point(363,375),new Point(362,378),new Point(358,384),new Point(358,384),new Point(357,387),new Point(354,391),new Point(352,393),new Point(352,393),new Point(348,401),new Point(347,402),new Point(347,402),new Point(345,408),new Point(342,412),new Point(341,412),new Point(341,412),new Point(340,416),new Point(339,419),new Point(337,421),new Point(337,421),new Point(337,422),new Point(337,424),new Point(336,425),new Point(336,426),new Point(336,427),new Point(336,427),new Point(340,427),new Point(341,427),new Point(341,427),new Point(349,427),new Point(351,427),new Point(351,427),new Point(356,427),new Point(362,425),new Point(362,425),new Point(370,424),new Point(372,423),new Point(372,423),new Point(383,421),new Point(383,421),new Point(393,419),new Point(393,419),new Point(395,419),new Point(404,417),new Point(404,417),new Point(415,416),new Point(415,416),new Point(419,416),new Point(425,414),new Point(425,414),new Point(433,412),new Point(435,411),new Point(435,411),new Point(446,409),new Point(446,408),new Point(446,408),new Point(451,407),new Point(456,405),new Point(456,405),new Point(460,405),new Point(467,404),new Point(467,403),new Point(467,403),new Point(471,402),new Point(473,401),new Point(475,401),new Point(476,401),new Point(476,401),new Point(477,401),new Point(476,401),new Point(476,401),new Point(476,401),new Point(473,405),new Point(470,408),new Point(470,408),new Point(467,413),new Point(463,417),new Point(463,417),new Point(463,418),new Point(456,424),new Point(456,424),new Point(452,429),new Point(449,433),new Point(449,433),new Point(443,442),new Point(443,442),new Point(442,444),new Point(437,450),new Point(437,450),new Point(431,459),new Point(431,459),new Point(428,464),new Point(424,468),new Point(424,468),new Point(418,477),new Point(418,477),new Point(414,484),new Point(412,486),new Point(412,486),new Point(406,494),new Point(406,494),new Point(400,503),new Point(400,503),new Point(399,507),new Point(395,513),new Point(395,513),new Point(389,522),new Point(389,522),new Point(384,531),new Point(383,531),new Point(383,531),new Point(378,540),new Point(378,540),new Point(378,542),new Point(373,550),new Point(373,550),new Point(368,559),new Point(368,559),new Point(366,564),new Point(363,568),new Point(363,568),new Point(358,578),new Point(358,578),new Point(353,587),new Point(353,587),new Point(350,594),new Point(348,597),new Point(348,597),new Point(345,605),new Point(343,606),new Point(343,606),new Point(338,616),new Point(338,616),new Point(336,620),new Point(334,625),new Point(333,625),new Point(333,625),new Point(327,634),new Point(327,634),new Point(324,640),new Point(322,643),new Point(321,643),new Point(321,643),new Point(320,647),new Point(318,651),new Point(317,652),new Point(317,652),new Point(317,652),new Point(317,653),new Point(317,653)));
this.Unistrokes[8] = new Unistroke("slower", new Array(new Point(348,238),new Point(348,238),new Point(353,238),new Point(360,239),new Point(374,242),new Point(374,242),new Point(374,242),new Point(385,244),new Point(401,244),new Point(401,244),new Point(402,245),new Point(422,249),new Point(428,249),new Point(428,249),new Point(450,251),new Point(454,251),new Point(454,251),new Point(467,251),new Point(481,252),new Point(481,252),new Point(508,253),new Point(508,253),new Point(523,255),new Point(535,255),new Point(535,255),new Point(540,255),new Point(557,255),new Point(562,255),new Point(562,255),new Point(585,255),new Point(589,255),new Point(589,255),new Point(613,255),new Point(616,255),new Point(616,255),new Point(627,255),new Point(638,255),new Point(643,255),new Point(643,255),new Point(652,257),new Point(663,258),new Point(670,260),new Point(670,260),new Point(674,261),new Point(679,262),new Point(688,263),new Point(694,265),new Point(696,265),new Point(696,265),new Point(699,265),new Point(701,267),new Point(703,267),new Point(704,267),new Point(705,268),new Point(705,268),new Point(705,268),new Point(706,268),new Point(706,268),new Point(706,269),new Point(706,269),new Point(705,269),new Point(702,272),new Point(698,275),new Point(693,278),new Point(693,278),new Point(687,284),new Point(672,294),new Point(672,294),new Point(667,298),new Point(651,311),new Point(651,311),new Point(649,314),new Point(630,329),new Point(630,329),new Point(620,338),new Point(610,346),new Point(610,346),new Point(590,365),new Point(590,365),new Point(577,378),new Point(571,384),new Point(571,384),new Point(554,403),new Point(553,404),new Point(553,404),new Point(535,424),new Point(535,424),new Point(519,444),new Point(517,445),new Point(517,445),new Point(499,464),new Point(499,464),new Point(496,469),new Point(482,485),new Point(482,485),new Point(465,506),new Point(465,506),new Point(455,520),new Point(448,527),new Point(448,527),new Point(439,540),new Point(430,548),new Point(430,548),new Point(424,555),new Point(413,568),new Point(413,568),new Point(408,575),new Point(399,586),new Point(396,589),new Point(396,589),new Point(389,599),new Point(382,607),new Point(379,610),new Point(379,610),new Point(378,612),new Point(375,616),new Point(374,617),new Point(373,619),new Point(373,620),new Point(373,620),new Point(373,620),new Point(373,620),new Point(375,621),new Point(380,621),new Point(387,621),new Point(388,621),new Point(388,621),new Point(401,621),new Point(415,619),new Point(415,619),new Point(418,619),new Point(442,619),new Point(442,619),new Point(442,619),new Point(462,619),new Point(469,619),new Point(469,619),new Point(494,619),new Point(496,619),new Point(496,619),new Point(523,620),new Point(523,620),new Point(542,621),new Point(550,621),new Point(550,621),new Point(570,621),new Point(577,621),new Point(577,621),new Point(604,621),new Point(604,621),new Point(611,621),new Point(625,621),new Point(631,620),new Point(631,620),new Point(642,619),new Point(657,618),new Point(657,618),new Point(662,618),new Point(683,616),new Point(684,615),new Point(684,615),new Point(687,615),new Point(699,612),new Point(705,611),new Point(710,611),new Point(711,610),new Point(711,610),new Point(713,610),new Point(715,610),new Point(717,609),new Point(718,609),new Point(718,609),new Point(718,609),new Point(718,609),new Point(718,609),new Point(718,608),new Point(718,606),new Point(715,602),new Point(706,594),new Point(706,594),new Point(706,594),new Point(698,586),new Point(686,574),new Point(686,574),new Point(680,568),new Point(667,556),new Point(667,556),new Point(662,552),new Point(648,536),new Point(648,536),new Point(643,530),new Point(629,517),new Point(629,517),new Point(622,511),new Point(609,499),new Point(609,499),new Point(596,488),new Point(589,481),new Point(589,481),new Point(582,474),new Point(570,462),new Point(570,462),new Point(555,447),new Point(551,443),new Point(551,443),new Point(532,424),new Point(532,424),new Point(528,420),new Point(513,405),new Point(513,405),new Point(501,393),new Point(494,385),new Point(494,385),new Point(482,372),new Point(475,366),new Point(475,366),new Point(468,360),new Point(456,347),new Point(456,347),new Point(452,342),new Point(439,326),new Point(439,326),new Point(436,322),new Point(422,307),new Point(421,306),new Point(421,306),new Point(410,294),new Point(402,286),new Point(402,286),new Point(401,285),new Point(394,279),new Point(390,273),new Point(384,269),new Point(383,268),new Point(383,268),new Point(380,266),new Point(379,264),new Point(377,263),new Point(376,262),new Point(376,262),new Point(376,261),new Point(376,261),new Point(376,261),new Point(375,261),new Point(375,260),new Point(375,260),new Point(374,260),new Point(374,259),new Point(374,258),new Point(374,258),new Point(373,257),new Point(373,257),new Point(373,257),new Point(373,256),new Point(373,254),new Point(372,253),new Point(372,252),new Point(371,252),new Point(371,252),new Point(371,251),new Point(370,251),new Point(370,250),new Point(370,250),new Point(370,250),new Point(370,250)));
  this.Unistrokes[9] = new Unistroke("select", new Array(new Point(501,314),new Point(501,314),new Point(512,312),new Point(517,311),new Point(517,311),new Point(526,310),new Point(533,308),new Point(533,308),new Point(540,308),new Point(549,307),new Point(549,307),new Point(566,307),new Point(566,307),new Point(582,307),new Point(582,307),new Point(599,307),new Point(599,307),new Point(605,307),new Point(615,309),new Point(615,309),new Point(631,312),new Point(631,312),new Point(642,314),new Point(647,315),new Point(647,315),new Point(662,320),new Point(663,320),new Point(663,320),new Point(678,328),new Point(678,328),new Point(684,332),new Point(691,337),new Point(691,337),new Point(700,344),new Point(704,348),new Point(704,348),new Point(714,361),new Point(714,361),new Point(719,366),new Point(725,373),new Point(725,373),new Point(735,386),new Point(735,386),new Point(735,386),new Point(743,400),new Point(743,400),new Point(744,401),new Point(749,416),new Point(749,416),new Point(751,421),new Point(755,431),new Point(755,431),new Point(758,438),new Point(759,447),new Point(759,447),new Point(762,462),new Point(762,463),new Point(762,463),new Point(765,479),new Point(765,480),new Point(765,480),new Point(767,496),new Point(766,496),new Point(766,496),new Point(765,512),new Point(765,512),new Point(765,528),new Point(764,529),new Point(764,529),new Point(763,535),new Point(757,544),new Point(757,544),new Point(756,548),new Point(749,558),new Point(749,558),new Point(746,564),new Point(740,572),new Point(740,572),new Point(738,576),new Point(731,585),new Point(731,585),new Point(731,586),new Point(722,597),new Point(720,598),new Point(720,598),new Point(716,604),new Point(708,609),new Point(708,609),new Point(708,610),new Point(701,615),new Point(695,619),new Point(695,619),new Point(681,628),new Point(681,628),new Point(681,629),new Point(670,633),new Point(666,634),new Point(666,634),new Point(659,636),new Point(650,638),new Point(650,638),new Point(642,640),new Point(633,640),new Point(633,640),new Point(618,640),new Point(617,640),new Point(617,640),new Point(601,640),new Point(600,640),new Point(600,640),new Point(584,640),new Point(584,640),new Point(584,640),new Point(568,634),new Point(568,634),new Point(560,632),new Point(554,628),new Point(554,628),new Point(545,622),new Point(540,618),new Point(540,618),new Point(527,608),new Point(527,608),new Point(521,604),new Point(514,597),new Point(514,597),new Point(511,594),new Point(503,586),new Point(503,586),new Point(500,583),new Point(492,574),new Point(492,574),new Point(484,565),new Point(481,561),new Point(481,561),new Point(474,551),new Point(472,548),new Point(472,548),new Point(465,536),new Point(463,533),new Point(463,533),new Point(455,521),new Point(454,520),new Point(454,520),new Point(451,510),new Point(449,504),new Point(449,504),new Point(448,498),new Point(445,488),new Point(445,488),new Point(445,485),new Point(444,478),new Point(443,472),new Point(443,472),new Point(442,464),new Point(442,455),new Point(442,455),new Point(442,455),new Point(442,447),new Point(442,440),new Point(442,439),new Point(442,439),new Point(442,433),new Point(445,425),new Point(445,423),new Point(445,423),new Point(450,417),new Point(453,409),new Point(453,409),new Point(455,407),new Point(462,398),new Point(463,396),new Point(463,396),new Point(467,392),new Point(472,384),new Point(473,382),new Point(473,382),new Point(483,369),new Point(483,369),new Point(485,368),new Point(488,364),new Point(491,360),new Point(493,357),new Point(493,357),new Point(495,356),new Point(499,353),new Point(502,349),new Point(504,346),new Point(505,345),new Point(505,345),new Point(506,345),new Point(507,345),new Point(508,344),new Point(508,344),new Point(509,343),new Point(509,343),new Point(509,343),new Point(510,343),new Point(510,343),new Point(511,343),new Point(511,342),new Point(513,342),new Point(516,341),new Point(518,339),new Point(518,339),new Point(519,339)));
  this.Unistrokes[10] = new Unistroke("resize", new Array(new Point(281,285),new Point(281,285),new Point(281,292),new Point(281,301),new Point(281,306),new Point(281,306),new Point(281,315),new Point(281,328),new Point(281,328),new Point(282,335),new Point(282,349),new Point(282,349),new Point(282,363),new Point(282,371),new Point(282,371),new Point(282,390),new Point(282,392),new Point(282,392),new Point(283,414),new Point(283,414),new Point(285,427),new Point(285,435),new Point(285,435),new Point(285,451),new Point(285,457),new Point(285,457),new Point(286,478),new Point(286,478),new Point(287,483),new Point(287,500),new Point(287,500),new Point(287,511),new Point(287,521),new Point(287,521),new Point(287,528),new Point(287,543),new Point(287,543),new Point(287,548),new Point(287,557),new Point(287,564),new Point(287,564),new Point(287,574),new Point(287,582),new Point(287,586),new Point(287,586),new Point(287,591),new Point(287,598),new Point(287,603),new Point(287,607),new Point(287,607),new Point(287,607),new Point(287,611),new Point(287,613),new Point(287,614),new Point(287,615),new Point(287,615),new Point(287,615),new Point(287,616),new Point(288,616),new Point(293,616),new Point(300,614),new Point(300,614),new Point(307,614),new Point(321,611),new Point(321,610),new Point(321,610),new Point(342,609),new Point(342,609),new Point(349,609),new Point(364,607),new Point(364,607),new Point(366,607),new Point(385,605),new Point(385,605),new Point(393,605),new Point(407,605),new Point(407,605),new Point(425,605),new Point(428,604),new Point(428,604),new Point(450,601),new Point(450,601),new Point(462,600),new Point(471,599),new Point(471,599),new Point(479,599),new Point(493,599),new Point(493,599),new Point(507,599),new Point(514,598),new Point(514,598),new Point(531,597),new Point(536,596),new Point(536,596),new Point(545,595),new Point(557,595),new Point(557,595),new Point(558,595),new Point(567,595),new Point(578,594),new Point(578,594),new Point(578,594),new Point(595,594),new Point(600,593),new Point(600,593),new Point(602,593),new Point(609,593),new Point(615,593),new Point(621,592),new Point(621,592),new Point(629,591),new Point(632,591),new Point(639,591),new Point(643,591),new Point(643,591),new Point(644,591),new Point(647,591),new Point(650,590),new Point(652,590),new Point(653,590),new Point(654,590),new Point(655,590),new Point(655,590),new Point(655,590),new Point(656,590),new Point(656,585),new Point(656,581),new Point(656,581),new Point(656,580),new Point(656,572),new Point(657,559),new Point(657,559),new Point(658,548),new Point(658,538),new Point(658,538),new Point(658,524),new Point(658,516),new Point(658,516),new Point(658,495),new Point(658,495),new Point(658,492),new Point(658,475),new Point(658,473),new Point(658,473),new Point(658,452),new Point(658,452),new Point(658,438),new Point(658,430),new Point(658,430),new Point(658,409),new Point(658,409),new Point(658,406),new Point(658,387),new Point(658,387),new Point(658,378),new Point(658,366),new Point(658,366),new Point(660,354),new Point(660,344),new Point(660,344),new Point(660,334),new Point(660,323),new Point(660,323),new Point(661,320),new Point(663,311),new Point(663,301),new Point(663,301),new Point(664,300),new Point(664,291),new Point(665,285),new Point(665,280),new Point(665,280),new Point(665,278),new Point(666,275),new Point(666,272),new Point(666,270),new Point(666,269),new Point(666,268),new Point(666,267),new Point(666,267),new Point(666,266),new Point(666,266),new Point(666,266),new Point(665,266),new Point(663,266),new Point(658,266),new Point(658,266),new Point(658,266),new Point(652,266),new Point(643,269),new Point(637,269),new Point(637,269),new Point(632,270),new Point(616,271),new Point(616,271),new Point(615,272),new Point(595,273),new Point(595,273),new Point(595,274),new Point(573,276),new Point(573,276),new Point(571,277),new Point(554,279),new Point(552,279),new Point(552,279),new Point(530,280),new Point(530,280),new Point(522,281),new Point(509,282),new Point(509,282),new Point(490,284),new Point(487,284),new Point(487,284),new Point(469,286),new Point(466,286),new Point(466,286),new Point(444,286),new Point(444,286),new Point(437,286),new Point(423,286),new Point(423,286),new Point(413,286),new Point(401,286),new Point(401,286),new Point(397,286),new Point(380,282),new Point(380,282),new Point(380,282),new Point(373,282),new Point(359,281),new Point(359,281),new Point(359,281),new Point(352,280),new Point(346,280),new Point(343,279),new Point(342,279),new Point(340,279),new Point(339,279),new Point(338,279),new Point(338,279),new Point(338,279)));
  this.Unistrokes[11] = new Unistroke("mute", new Array(new Point(248,518),new Point(248,518),new Point(248,517),new Point(248,513),new Point(248,505),new Point(252,496),new Point(252,494),new Point(252,494),new Point(258,472),new Point(258,470),new Point(258,470),new Point(261,455),new Point(263,446),new Point(263,446),new Point(270,427),new Point(271,422),new Point(271,422),new Point(279,399),new Point(279,399),new Point(281,395),new Point(288,376),new Point(288,376),new Point(292,367),new Point(296,353),new Point(296,353),new Point(303,335),new Point(305,330),new Point(305,330),new Point(317,308),new Point(317,308),new Point(321,301),new Point(327,286),new Point(327,286),new Point(330,279),new Point(339,264),new Point(339,264),new Point(342,261),new Point(351,243),new Point(351,243),new Point(362,225),new Point(364,222),new Point(364,222),new Point(369,217),new Point(374,213),new Point(382,205),new Point(382,205),new Point(385,203),new Point(397,196),new Point(403,195),new Point(403,195),new Point(404,195),new Point(410,195),new Point(422,195),new Point(428,197),new Point(428,197),new Point(428,197),new Point(437,205),new Point(444,215),new Point(444,215),new Point(447,220),new Point(455,236),new Point(455,237),new Point(455,237),new Point(462,252),new Point(464,260),new Point(464,260),new Point(469,273),new Point(472,283),new Point(472,283),new Point(477,297),new Point(479,307),new Point(479,307),new Point(484,324),new Point(486,331),new Point(486,331),new Point(492,352),new Point(492,355),new Point(492,355),new Point(496,379),new Point(496,379),new Point(497,380),new Point(499,403),new Point(499,403),new Point(502,422),new Point(503,428),new Point(503,428),new Point(508,452),new Point(508,452),new Point(509,454),new Point(511,476),new Point(511,476),new Point(513,486),new Point(516,497),new Point(516,500),new Point(516,500),new Point(517,508),new Point(521,525),new Point(521,525),new Point(521,525),new Point(522,534),new Point(523,540),new Point(524,544),new Point(525,546),new Point(525,547),new Point(525,547),new Point(525,547),new Point(525,545),new Point(525,544),new Point(525,544),new Point(525,541),new Point(524,537),new Point(523,532),new Point(522,523),new Point(521,520),new Point(521,520),new Point(521,514),new Point(521,500),new Point(521,495),new Point(521,495),new Point(521,477),new Point(521,471),new Point(521,471),new Point(521,453),new Point(521,446),new Point(521,446),new Point(521,421),new Point(521,421),new Point(521,416),new Point(523,397),new Point(523,397),new Point(525,379),new Point(527,373),new Point(527,373),new Point(535,349),new Point(535,349),new Point(538,343),new Point(544,326),new Point(544,326),new Point(553,304),new Point(553,303),new Point(553,303),new Point(564,281),new Point(564,281),new Point(566,278),new Point(577,260),new Point(577,260),new Point(581,255),new Point(591,240),new Point(591,240),new Point(594,238),new Point(606,224),new Point(607,222),new Point(607,222),new Point(617,214),new Point(624,207),new Point(626,205),new Point(626,205),new Point(642,196),new Point(647,194),new Point(647,194),new Point(651,194),new Point(665,194),new Point(672,194),new Point(672,194),new Point(676,194),new Point(687,198),new Point(692,205),new Point(692,205),new Point(698,212),new Point(708,224),new Point(708,224),new Point(711,228),new Point(717,242),new Point(718,246),new Point(718,246),new Point(723,259),new Point(727,269),new Point(727,269),new Point(731,279),new Point(734,293),new Point(734,293),new Point(736,299),new Point(740,317),new Point(740,317),new Point(742,323),new Point(745,341),new Point(745,341),new Point(746,344),new Point(748,365),new Point(748,365),new Point(751,385),new Point(751,390),new Point(751,390),new Point(753,409),new Point(753,414),new Point(753,414),new Point(755,429),new Point(755,439),new Point(755,439),new Point(755,461),new Point(755,464),new Point(755,464),new Point(755,472),new Point(755,481),new Point(755,488),new Point(755,488),new Point(755,495),new Point(755,506),new Point(754,513),new Point(754,513),new Point(754,520),new Point(753,525),new Point(753,528),new Point(753,537),new Point(753,538)));
  //
  // The $1 Gesture Recognizer API begins here -- 3 methods: Recognize(), AddGesture(), and DeleteUserGestures()
  //
  this.Recognize = function(points, useProtractor)
  {
    points = Resample(points, NumPoints);
    var radians = IndicativeAngle(points);
    points = RotateBy(points, -radians);
    points = ScaleTo(points, SquareSize);
    points = TranslateTo(points, Origin);
    var vector = Vectorize(points); // for Protractor

    var b = +Infinity;
    var u = -1;
    for (var i = 0; i < this.Unistrokes.length; i++) // for each unistroke
    {
      var d;
      if (useProtractor) // for Protractor
        d = OptimalCosineDistance(this.Unistrokes[i].Vector, vector);
      else // Golden Section Search (original $1)
        d = DistanceAtBestAngle(points, this.Unistrokes[i], -AngleRange, +AngleRange, AnglePrecision);
      if (d < b) {
        b = d; // best (least) distance
        u = i; // unistroke
      }
    }
    return (u == -1) ? new Result("No match.", 0) : new Result(this.Unistrokes[u].Name, useProtractor ? 1 / b : 1 - b / HalfDiagonal);
  };
  this.AddGesture = function(name, points)
  {
    this.Unistrokes[this.Unistrokes.length] = new Unistroke(name, points); // append new unistroke
    console.log(this.Unistrokes[this.Unistrokes.length-1].toString());
    var num = 0;
    for (var i = 0; i < this.Unistrokes.length; i++) {
      if (this.Unistrokes[i].Name == name)
        num++;
    }
    return num;
  }
  this.DeleteUserGestures = function()
  {
    this.Unistrokes.length = NumUnistrokes; // clear any beyond the original set
    return NumUnistrokes;
  }
}
//
// Private helper functions from this point down
//
function Resample(points, n)
{
  var I = PathLength(points) / (n - 1); // interval length
  var D = 0;
  var newpoints = new Array(points[0]);
  for (var i = 1; i < points.length; i++)
  {
    var d = Distance(points[i - 1], points[i]);
    if ((D + d) >= I)
    {
      var qx = points[i - 1].X + ((I - D) / d) * (points[i].X - points[i - 1].X);
      var qy = points[i - 1].Y + ((I - D) / d) * (points[i].Y - points[i - 1].Y);
      var q = new Point(qx, qy);
      newpoints[newpoints.length] = q; // append new point 'q'
      points.splice(i, 0, q); // insert 'q' at position i in points s.t. 'q' will be the next i
      D = 0;
    }
    else D += d;
  }
  if (newpoints.length == n - 1) // somtimes we fall a rounding-error short of adding the last point, so add it if so
    newpoints[newpoints.length] = new Point(points[points.length - 1].X, points[points.length - 1].Y);
  return newpoints;
}
function IndicativeAngle(points)
{
  var c = Centroid(points);
  return Math.atan2(c.Y - points[0].Y, c.X - points[0].X);
}
function RotateBy(points, radians) // rotates points around centroid
{
  var c = Centroid(points);
  var cos = Math.cos(radians);
  var sin = Math.sin(radians);
  var newpoints = new Array();
  for (var i = 0; i < points.length; i++) {
    var qx = (points[i].X - c.X) * cos - (points[i].Y - c.Y) * sin + c.X
    var qy = (points[i].X - c.X) * sin + (points[i].Y - c.Y) * cos + c.Y;
    newpoints[newpoints.length] = new Point(qx, qy);
  }
  return newpoints;
}
function ScaleTo(points, size) // non-uniform scale; assumes 2D gestures (i.e., no lines)
{
  var B = BoundingBox(points);
  var newpoints = new Array();
  for (var i = 0; i < points.length; i++) {
    var qx = points[i].X * (size / B.Width);
    var qy = points[i].Y * (size / B.Height);
    newpoints[newpoints.length] = new Point(qx, qy);
  }
  return newpoints;
}
function TranslateTo(points, pt) // translates points' centroid
{
  var c = Centroid(points);
  var newpoints = new Array();
  for (var i = 0; i < points.length; i++) {
    var qx = points[i].X + pt.X - c.X;
    var qy = points[i].Y + pt.Y - c.Y;
    newpoints[newpoints.length] = new Point(qx, qy);
  }
  return newpoints;
}
function Vectorize(points) // for Protractor
{
  var sum = 0;
  var vector = new Array();
  for (var i = 0; i < points.length; i++) {
    vector[vector.length] = points[i].X;
    vector[vector.length] = points[i].Y;
    sum += points[i].X * points[i].X + points[i].Y * points[i].Y;
  }
  var magnitude = Math.sqrt(sum);
  for (var i = 0; i < vector.length; i++)
    vector[i] /= magnitude;
  return vector;
}
function OptimalCosineDistance(v1, v2) // for Protractor
{
  var a = 0;
  var b = 0;
  for (var i = 0; i < v1.length; i += 2) {
    a += v1[i] * v2[i] + v1[i + 1] * v2[i + 1];
                b += v1[i] * v2[i + 1] - v1[i + 1] * v2[i];
  }
  var angle = Math.atan(b / a);
  return Math.acos(a * Math.cos(angle) + b * Math.sin(angle));
}
function DistanceAtBestAngle(points, T, a, b, threshold)
{
  var x1 = Phi * a + (1 - Phi) * b;
  var f1 = DistanceAtAngle(points, T, x1);
  var x2 = (1 - Phi) * a + Phi * b;
  var f2 = DistanceAtAngle(points, T, x2);
  while (Math.abs(b - a) > threshold)
  {
    if (f1 < f2) {
      b = x2;
      x2 = x1;
      f2 = f1;
      x1 = Phi * a + (1 - Phi) * b;
      f1 = DistanceAtAngle(points, T, x1);
    } else {
      a = x1;
      x1 = x2;
      f1 = f2;
      x2 = (1 - Phi) * a + Phi * b;
      f2 = DistanceAtAngle(points, T, x2);
    }
  }
  return Math.min(f1, f2);
}
function DistanceAtAngle(points, T, radians)
{
  var newpoints = RotateBy(points, radians);
  return PathDistance(newpoints, T.Points);
}
function Centroid(points)
{
  var x = 0, y = 0;
  for (var i = 0; i < points.length; i++) {
    x += points[i].X;
    y += points[i].Y;
  }
  x /= points.length;
  y /= points.length;
  return new Point(x, y);
}
function BoundingBox(points)
{
  var minX = +Infinity, maxX = -Infinity, minY = +Infinity, maxY = -Infinity;
  for (var i = 0; i < points.length; i++) {
    minX = Math.min(minX, points[i].X);
    minY = Math.min(minY, points[i].Y);
    maxX = Math.max(maxX, points[i].X);
    maxY = Math.max(maxY, points[i].Y);
  }
  return new Rectangle(minX, minY, maxX - minX, maxY - minY);
}
function PathDistance(pts1, pts2)
{
  var d = 0;
  for (var i = 0; i < pts1.length; i++) // assumes pts1.length == pts2.length
    d += Distance(pts1[i], pts2[i]);
  return d / pts1.length;
}
function PathLength(points)
{
  var d = 0;
  for (var i = 1; i < points.length; i++)
    d += Distance(points[i - 1], points[i]);
  return d;
}
function Distance(p1, p2)
{
  var dx = p2.X - p1.X;
  var dy = p2.Y - p1.Y;
  return Math.sqrt(dx * dx + dy * dy);
}
function Deg2Rad(d) { return (d * Math.PI / 180); }
