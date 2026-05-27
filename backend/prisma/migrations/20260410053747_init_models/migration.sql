-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstname` VARCHAR(255) NOT NULL,
    `lastname` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `original_password` VARCHAR(255) NULL,
    `contact_number` VARCHAR(20) NOT NULL,
    `country` VARCHAR(255) NOT NULL,
    `state` VARCHAR(255) NOT NULL,
    `city` VARCHAR(255) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `zipcode` INTEGER NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `usertype` VARCHAR(255) NOT NULL DEFAULT '1',
    `status` INTEGER NOT NULL DEFAULT 0,
    `subscription_type` INTEGER NOT NULL DEFAULT 0,
    `create_date` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deleted` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `amenities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `property_id` INTEGER NOT NULL,
    `children_suitability` VARCHAR(255) NULL,
    `smoking_suitability` VARCHAR(255) NULL,
    `wheelchair_suitability` VARCHAR(255) NULL,
    `pets_suitability` VARCHAR(255) NULL,
    `other_suitability` TEXT NULL,
    `kitchen_dining` TEXT NULL,
    `dining_area` TEXT NULL,
    `dining_seats` VARCHAR(255) NULL,
    `popular_amenities` TEXT NULL,
    `entertainment` TEXT NULL,
    `safety_features` TEXT NULL,
    `setting_view` TEXT NULL,
    `attractions` TEXT NULL,
    `leisure` TEXT NULL,
    `sports` TEXT NULL,
    `pool_spa` TEXT NULL,
    `outdoor_features` TEXT NULL,
    `accomodation_type` TEXT NULL,
    `meals` VARCHAR(255) NULL,
    `breakfast` VARCHAR(255) NULL,
    `lunch` VARCHAR(255) NULL,
    `dinner` VARCHAR(255) NULL,
    `house_keeping` TEXT NULL,
    `other_services` TEXT NULL,
    `themes` TEXT NULL,
    `additional_info` TEXT NULL,
    `bicycle_qty` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bedding_info` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `property_id` INTEGER NOT NULL,
    `king` VARCHAR(255) NULL,
    `queen` VARCHAR(255) NULL,
    `double_bed` VARCHAR(255) NULL,
    `twin_single` VARCHAR(255) NULL,
    `child_bed` VARCHAR(255) NULL,
    `baby_crib` VARCHAR(255) NULL,
    `sleep_sofa_futon` VARCHAR(255) NULL,
    `note` VARCHAR(1024) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bookings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_item` INTEGER NOT NULL DEFAULT 0,
    `the_date` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `id_state` INTEGER NOT NULL DEFAULT 0,
    `id_booking` INTEGER NOT NULL DEFAULT 0,

    INDEX `id_item`(`id_item`),
    INDEX `id_state`(`id_state`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bookings_admin_users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `level` TINYINT NOT NULL DEFAULT 2,
    `username` VARCHAR(20) NOT NULL DEFAULT '',
    `password` VARCHAR(32) NOT NULL DEFAULT '',
    `state` TINYINT NOT NULL DEFAULT 1,
    `date_visit` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `visits` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bookings_config` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL DEFAULT '',
    `num_months` TINYINT NOT NULL DEFAULT 3,
    `default_lang` VARCHAR(6) NOT NULL DEFAULT 'en',
    `theme` VARCHAR(50) NOT NULL DEFAULT 'default',
    `start_day` ENUM('mon', 'sun') NOT NULL DEFAULT 'sun',
    `date_format` ENUM('us', 'eu') NOT NULL DEFAULT 'eu',
    `click_past_dates` ENUM('on', 'off') NOT NULL DEFAULT 'off',
    `cal_url` VARCHAR(255) NOT NULL DEFAULT '',
    `local_path` VARCHAR(255) NOT NULL DEFAULT '/calendar',
    `version` VARCHAR(10) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bookings_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` INTEGER NOT NULL DEFAULT 1,
    `id_ref_external` INTEGER NOT NULL,
    `desc_en` VARCHAR(100) NOT NULL DEFAULT '',
    `desc_es` VARCHAR(100) NOT NULL DEFAULT '',
    `list_order` INTEGER NOT NULL DEFAULT 0,
    `state` TINYINT NOT NULL DEFAULT 1,

    INDEX `id_user`(`id_user`),
    INDEX `id_ref_external`(`id_ref_external`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bookings_last_update` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_item` INTEGER NOT NULL DEFAULT 0,
    `date_mod` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `id_item`(`id_item`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bookings_states` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `desc_en` VARCHAR(100) NOT NULL DEFAULT '',
    `desc_es` VARCHAR(100) NOT NULL DEFAULT '',
    `code` VARCHAR(10) NOT NULL DEFAULT '',
    `state` TINYINT NOT NULL DEFAULT 1,
    `list_order` INTEGER NOT NULL DEFAULT 0,
    `class` VARCHAR(30) NOT NULL DEFAULT '',
    `show_in_key` TINYINT NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,
    `stunning` INTEGER NULL DEFAULT 0,
    `image` VARCHAR(100) NOT NULL,
    `state_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `claims_wix` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(100) NULL,
    `last_name` VARCHAR(100) NULL,
    `company_name` VARCHAR(100) NULL,
    `email` VARCHAR(100) NULL,
    `mobile_phone` VARCHAR(20) NULL,
    `work_phone` VARCHAR(20) NULL,
    `preferred_contact` VARCHAR(50) NULL,
    `billing_address` TEXT NULL,
    `billing_address_info` TEXT NULL,
    `city` VARCHAR(100) NULL,
    `state` VARCHAR(100) NULL,
    `zip_code` VARCHAR(20) NULL,
    `claim_id` VARCHAR(100) NULL,
    `ale_limit` VARCHAR(100) NULL,
    `claimant_full_name` VARCHAR(150) NULL,
    `claimant_loss_address` VARCHAR(100) NULL,
    `claimant_loss_address_info` VARCHAR(100) NULL,
    `claimant_city` VARCHAR(100) NULL,
    `claimant_state` VARCHAR(100) NULL,
    `claimant_zip_code` VARCHAR(20) NULL,
    `claimant_phone` VARCHAR(100) NULL,
    `insured_email` VARCHAR(150) NULL,
    `estimated_move_in` DATE NULL,
    `estimated_stay` VARCHAR(50) NULL,
    `type_of_housing` VARCHAR(50) NULL,
    `other_housing_type` VARCHAR(100) NULL,
    `number_of_occupants` INTEGER NULL,
    `adults_in_housing` INTEGER NULL,
    `children_in_housing` INTEGER NULL,
    `bedrooms` INTEGER NULL,
    `bathrooms` INTEGER NULL,
    `have_pets` VARCHAR(10) NULL,
    `referred_by` VARCHAR(100) NULL,
    `additional_needs` TEXT NULL,
    `submitted_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contact` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `property_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NULL,
    `country` VARCHAR(255) NULL,
    `state` VARCHAR(255) NULL,
    `city` VARCHAR(255) NULL,
    `street_address` TEXT NULL,
    `zip` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `reg_email` VARCHAR(255) NULL,
    `phonecode` VARCHAR(255) NULL,
    `phone_note` TEXT NULL,
    `mobile_number` VARCHAR(255) NULL,
    `contact_phone` VARCHAR(255) NULL,
    `calling_hours` VARCHAR(255) NULL,
    `fax_number` VARCHAR(255) NULL,
    `fax_info` VARCHAR(255) NULL,
    `alt_email` VARCHAR(255) NULL,
    `sms_number` VARCHAR(255) NOT NULL,
    `oth_language` TEXT NOT NULL,
    `enquiry_lang` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contact_us` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstname` VARCHAR(255) NOT NULL,
    `lastname` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `website` VARCHAR(255) NOT NULL,
    `message` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `countries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(20) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `latitude` VARCHAR(255) NOT NULL,
    `longitude` VARCHAR(255) NOT NULL,
    `phonecode1` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `countries1` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(20) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `latitude` VARCHAR(255) NOT NULL,
    `longitude` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `covid19_donations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `middle_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `street_address` VARCHAR(255) NOT NULL,
    `address_line_2` VARCHAR(255) NOT NULL,
    `country` VARCHAR(255) NOT NULL,
    `state` VARCHAR(255) NOT NULL,
    `city` VARCHAR(255) NOT NULL,
    `postal_code` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(255) NOT NULL,
    `amount` VARCHAR(255) NOT NULL,
    `response` TEXT NOT NULL,
    `status` VARCHAR(255) NOT NULL,
    `created_date` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `currency` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `code` VARCHAR(100) NOT NULL,
    `converion_rate` DOUBLE NOT NULL,
    `currency` VARCHAR(50) NOT NULL,
    `pound_conversion` VARCHAR(255) NOT NULL,
    `currency_code` INTEGER NOT NULL DEFAULT 2,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `feedback` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `feedback_message` MEDIUMTEXT NOT NULL,
    `user_image` VARCHAR(255) NOT NULL,
    `rating` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `nearby_places` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `property_id` INTEGER NOT NULL,
    `nearest_airport` VARCHAR(255) NULL,
    `airport_distance` VARCHAR(255) NULL,
    `nearest_beach` VARCHAR(255) NULL,
    `beach_distance` VARCHAR(255) NULL,
    `nearest_ferry` VARCHAR(255) NULL,
    `ferry_distance` VARCHAR(255) NULL,
    `nearest_train` VARCHAR(255) NULL,
    `train_distance` VARCHAR(255) NULL,
    `nearest_highway` VARCHAR(255) NULL,
    `highway_distance` VARCHAR(255) NULL,
    `nearest_bar` VARCHAR(255) NULL,
    `bar_distance` VARCHAR(255) NULL,
    `nearest_ski` VARCHAR(255) NULL,
    `ski_distance` VARCHAR(255) NULL,
    `nearest_golf` VARCHAR(255) NULL,
    `golf_distance` VARCHAR(255) NULL,
    `nearest_restaurant` VARCHAR(255) NULL,
    `restaurant_distance` VARCHAR(255) NULL,
    `near_motor` VARCHAR(255) NULL,
    `motor_dist` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `owners_messages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `propertyID` INTEGER NOT NULL,
    `property_owner` INTEGER NOT NULL,
    `firstname` VARCHAR(255) NOT NULL,
    `lastname` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `country` INTEGER NOT NULL,
    `arrival` VARCHAR(255) NOT NULL,
    `departure` VARCHAR(255) NOT NULL,
    `adults` INTEGER NOT NULL,
    `childs` INTEGER NOT NULL,
    `travel` INTEGER NULL,
    `message` LONGTEXT NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_detail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `transaction_by` INTEGER NOT NULL,
    `response` TEXT NOT NULL,
    `status` VARCHAR(255) NOT NULL,
    `amount` VARCHAR(255) NOT NULL,
    `plan_type` INTEGER NOT NULL,
    `no_of_property` INTEGER NOT NULL,
    `description` TEXT NOT NULL,
    `created_date` DATETIME(0) NOT NULL,
    `data` VARCHAR(50) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `photos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `property_id` INTEGER NOT NULL,
    `image_name` VARCHAR(255) NULL,
    `default_image` INTEGER NULL DEFAULT 0,
    `image_order` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `plan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `plan_name` VARCHAR(255) NOT NULL,
    `price` VARCHAR(255) NOT NULL,
    `description1` TEXT NOT NULL,
    `description2` VARCHAR(255) NOT NULL,
    `description3` VARCHAR(255) NOT NULL,
    `description4` VARCHAR(255) NOT NULL,
    `description5` VARCHAR(255) NOT NULL,
    `description6` VARCHAR(255) NOT NULL,
    `description7` VARCHAR(255) NOT NULL,
    `description8` VARCHAR(255) NOT NULL,
    `description9` VARCHAR(255) NOT NULL,
    `description10` VARCHAR(255) NOT NULL,
    `description11` VARCHAR(255) NOT NULL,
    `description12` VARCHAR(255) NOT NULL,
    `description13` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `promotional_code` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NULL,
    `code` VARCHAR(255) NULL,
    `updated` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `property` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `property_headline` TEXT NULL,
    `summary` TEXT NULL,
    `country` VARCHAR(255) NULL,
    `state` VARCHAR(255) NULL,
    `city` VARCHAR(255) NULL,
    `street_address` TEXT NULL,
    `zip` VARCHAR(255) NULL,
    `recommended` INTEGER NULL,
    `property_description` TEXT NULL,
    `bedroom` VARCHAR(255) NULL,
    `bathroom` VARCHAR(255) NULL,
    `property_type` VARCHAR(255) NULL,
    `situated_in` INTEGER NULL,
    `property_view_id` INTEGER NULL,
    `on_which_floor` VARCHAR(255) NULL,
    `elevator` VARCHAR(255) NULL,
    `sleeps` VARCHAR(255) NULL DEFAULT '0',
    `assign_to` INTEGER NULL,
    `priority` INTEGER NULL,
    `priority_date` DATETIME(0) NULL,
    `created_by` INTEGER NULL,
    `year_purchased` VARCHAR(11) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `property_bookings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `property_id` INTEGER NOT NULL,
    `property_owner` INTEGER NULL,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `mobile` VARCHAR(255) NOT NULL,
    `message` LONGTEXT NOT NULL,
    `adults` INTEGER NULL DEFAULT 0,
    `childs` INTEGER NULL DEFAULT 0,
    `street` VARCHAR(255) NOT NULL,
    `country` VARCHAR(255) NOT NULL,
    `city` VARCHAR(255) NOT NULL,
    `zip` VARCHAR(255) NOT NULL,
    `transaction_id` VARCHAR(50) NULL,
    `terms` INTEGER NOT NULL,
    `response` VARCHAR(255) NOT NULL,
    `status` VARCHAR(255) NOT NULL,
    `amount` VARCHAR(255) NOT NULL,
    `booking_dates` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `property_descriptions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `property_id` INTEGER NOT NULL,
    `toaster_desc` TEXT NULL,
    `kitchen_desc` TEXT NULL,
    `dishwasher_desc` TEXT NULL,
    `microwave_desc` TEXT NULL,
    `coffee_make_desc` TEXT NULL,
    `pantry_item_desc` TEXT NULL,
    `oven_desc` TEXT NULL,
    `stove_desc` TEXT NULL,
    `refrigerator_desc` TEXT NULL,
    `dish_uten_desc` TEXT NULL,
    `heating_desc` TEXT NULL,
    `fireplace_desc` TEXT NULL,
    `internet_desc` TEXT NULL,
    `living_room_desc` TEXT NULL,
    `towels_provided_desc` TEXT NULL,
    `w_internet_desc` TEXT NULL,
    `washing_m_desc` TEXT NULL,
    `parking_desc` TEXT NULL,
    `linens_p_desc` TEXT NULL,
    `telephone_desc` TEXT NULL,
    `fitness_r_e_desc` TEXT NULL,
    `ac_desc` TEXT NULL,
    `cloth_dryer_desc` TEXT NULL,
    `tv_desc` TEXT NULL,
    `pool_t_desc` TEXT NULL,
    `game_r_decs` TEXT NULL,
    `video_l_desc` TEXT NULL,
    `satellite_c_desc` TEXT NULL,
    `pi_po_desc` TEXT NULL,
    `spa_w_desc` TEXT NULL,
    `hottub_desc` TEXT NULL,
    `sauna_desc` TEXT NULL,
    `commu_pool_desc` TEXT NULL,
    `balcony_desc` TEXT NULL,
    `dect_pa_desc` TEXT NULL,
    `law_g_desc` TEXT NULL,
    `smoke_d_desc` TEXT NULL,
    `cmd_loca` TEXT NULL,
    `fe_location` TEXT NULL,
    `fak_location` TEXT NULL,
    `eer_inst` TEXT NULL,
    `hcontact_desc` TEXT NULL,
    `pcontact_desc` TEXT NULL,
    `fstation_desc` TEXT NULL,
    `additional_loca_info` TEXT NULL,
    `about_creater` TEXT NULL,
    `y_this_pro` TEXT NULL,
    `unique_bene` TEXT NULL,
    `bed_desc` TEXT NULL,
    `bath_desc` TEXT NULL,
    `add_info` TEXT NULL,
    `youtube_url` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `property_extras` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `property_id` INTEGER NOT NULL,
    `pet_fee` VARCHAR(255) NULL,
    `cleaning_fee` VARCHAR(255) NULL,
    `taxes` VARCHAR(255) NULL,
    `damage_protection` VARCHAR(255) NULL,
    `payment_terms` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `property_type` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `property_name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `property_view` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `property_id` INTEGER NOT NULL,
    `season_name` VARCHAR(255) NULL,
    `start_date` DATE NULL,
    `end_date` DATE NULL,
    `minimum_stay` VARCHAR(255) NULL,
    `weekend_night` VARCHAR(255) NULL,
    `nightly` DOUBLE NULL,
    `weekly` VARCHAR(255) NULL,
    `monthly` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `states` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,
    `image` VARCHAR(100) NOT NULL,
    `stunning` INTEGER NULL DEFAULT 0,
    `country_id` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `term_condition` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `detail` LONGTEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `amenities` ADD CONSTRAINT `amenities_property_id_fkey` FOREIGN KEY (`property_id`) REFERENCES `property`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bedding_info` ADD CONSTRAINT `bedding_info_property_id_fkey` FOREIGN KEY (`property_id`) REFERENCES `property`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookings_items` ADD CONSTRAINT `bookings_items_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cities` ADD CONSTRAINT `cities_state_id_fkey` FOREIGN KEY (`state_id`) REFERENCES `states`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contact` ADD CONSTRAINT `contact_property_id_fkey` FOREIGN KEY (`property_id`) REFERENCES `property`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nearby_places` ADD CONSTRAINT `nearby_places_property_id_fkey` FOREIGN KEY (`property_id`) REFERENCES `property`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `owners_messages` ADD CONSTRAINT `owners_messages_propertyID_fkey` FOREIGN KEY (`propertyID`) REFERENCES `property`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_detail` ADD CONSTRAINT `payment_detail_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `photos` ADD CONSTRAINT `photos_property_id_fkey` FOREIGN KEY (`property_id`) REFERENCES `property`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `property_bookings` ADD CONSTRAINT `property_bookings_property_id_fkey` FOREIGN KEY (`property_id`) REFERENCES `property`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `property_descriptions` ADD CONSTRAINT `property_descriptions_property_id_fkey` FOREIGN KEY (`property_id`) REFERENCES `property`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `property_extras` ADD CONSTRAINT `property_extras_property_id_fkey` FOREIGN KEY (`property_id`) REFERENCES `property`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rates` ADD CONSTRAINT `rates_property_id_fkey` FOREIGN KEY (`property_id`) REFERENCES `property`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `states` ADD CONSTRAINT `states_country_id_fkey` FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
