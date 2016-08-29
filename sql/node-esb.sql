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

CREATE TABLE IF NOT EXISTS `cron` (
  `id` int(12) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL COMMENT 'cron的名字',
  `pattern` varchar(64) NOT NULL DEFAULT '* * * * * *' COMMENT 'cron 表达式',
  `options` text COMMENT '配置选项json',
  `active` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否启用0是不启用1是启用',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `active` (`active`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='cron job表' AUTO_INCREMENT=1;
