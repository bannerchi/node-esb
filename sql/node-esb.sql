--
-- database: `node-esb`
--

-- --------------------------------------------------------

--
-- table `listeners`
--

CREATE TABLE IF NOT EXISTS `listeners` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `exchange` varchar(50) NOT NULL,
  `queue` varchar(50) NOT NULL,
  `options` varchar(50) NOT NULL,
  `status` enum('online','offline') NOT NULL DEFAULT 'offline',
  `active` enum('enabled','disabled') NOT NULL DEFAULT 'enabled',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `name` (`name`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8;
